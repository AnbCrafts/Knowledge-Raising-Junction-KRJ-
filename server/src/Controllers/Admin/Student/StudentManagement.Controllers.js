import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import { Student } from "../../../Schema/Student/Student.Schema.js";
import { User } from "../../../Schema/User/User.Schema.js";
import { AcademicProfile } from "../../../Schema/AcademicDetails/AcademicProfile.Schema.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";
import { checkAdminPermission } from "../Admin.Utils.js";
import { objectId } from "../../../Validations/User/User.Validations.js";
import Joi from "joi";

const getAllStudents = asyncHandler(async (req, res) => {
  // 1. Check Permission
  await checkAdminPermission(req.user._id, "manage_students");

  const { page = 1, limit = 10, branchId, status, search } = req.query;

  const query = {};

  if (branchId) {
    query.branch = branchId;
  }

  if (status) {
    query.status = status;
  }

  // Basic search by fatherName (since User name is separate, but Student has fatherName)
  // Ideally we should search in User model too, but for now let's stick to Student fields or simple aggregation
  if (search) {
    query.$or = [
      { fatherName: { $regex: search, $options: "i" } },
      { motherName: { $regex: search, $options: "i" } },
    ];
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: "userId", select: "fullName email username phone" },
      { path: "branch", select: "name branchCode" },
      { path: "academicProfile", select: "currentClassYear section" },
      { path: "idCard", select: "idNumber" },
    ],
    lean: true,
  };

  const skip = (options.page - 1) * options.limit;

  const students = await Student.find(query)
    .sort(options.sort)
    .skip(skip)
    .limit(options.limit)
    .populate(options.populate)
    .lean();

  const total = await Student.countDocuments(query);

  return successResponse(res, {
    message: "Students fetched successfully",
    data: {
      students,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        pages: Math.ceil(total / options.limit),
      },
    },
  });
});

const getStudentProfile = asyncHandler(async (req, res) => {
  // 1. Check Permission
  await checkAdminPermission(req.user._id, "manage_students");

  const { studentId } = req.params;
  const { error } = objectId.required().validate(studentId);
  if (error) throw new ApiError(400, "Invalid Student ID");

  const student = await Student.findById(studentId)
    .populate({
      path: "userId",
      select: "-password -__v",
    })
    .populate("branch")
    .populate("academicProfile")
    .populate("idCard")
    .populate("assignedTeacher", "userId") // Assuming Teacher -> User link
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return successResponse(res, {
    message: "Student profile fetched successfully",
    data: student,
  });
});

const updateStudent = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_students");

  const { studentId } = req.params;
  const { error: idError } = objectId.required().validate(studentId);
  if (idError) throw new ApiError(400, "Invalid Student ID");

  // Allow updating user fields and student fields
  const schema = Joi.object({
    // User fields
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),

    // Student fields
    fatherName: Joi.string().optional(),
    motherName: Joi.string().optional(),
    address: Joi.string().optional(),
    status: Joi.string().valid("ACTIVE", "LEFT", "INACTIVE").optional(),

    // Academic fields (simplified for now)
    currentClassYear: Joi.string().optional(),
    section: Joi.string().optional(),
  }).unknown(true);

  const { error, value } = schema.validate(req.body);
  if (error) throw new ApiError(400, "Validation failed", error.details);

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  // Update User
  if (value.fullName || value.email || value.phone) {
    await User.findByIdAndUpdate(student.userId, {
      ...(value.fullName && { fullName: value.fullName }),
      ...(value.email && { email: value.email }),
      ...(value.phone && { phone: value.phone }),
    });
  }

  // Update Student
  if (value.fatherName) student.fatherName = value.fatherName;
  if (value.motherName) student.motherName = value.motherName;
  if (value.address) student.address = value.address;
  if (value.status) student.status = value.status;

  await student.save();

  // Update Academic Profile
  if (value.currentClassYear || value.section) {
    await AcademicProfile.findByIdAndUpdate(student.academicProfile, {
      ...(value.currentClassYear && {
        currentClassYear: value.currentClassYear,
      }),
      ...(value.section && { section: value.section }),
    });
  }

  return successResponse(res, {
    message: "Student updated successfully",
  });
});

export { getAllStudents, getStudentProfile, updateStudent };
