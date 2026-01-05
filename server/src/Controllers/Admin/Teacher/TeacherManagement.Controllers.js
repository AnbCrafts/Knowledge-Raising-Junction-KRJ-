import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import Teacher from "../../../Schema/Teacher/Teacher.Schema.js";
import { User } from "../../../Schema/User/User.Schema.js";
import { Employee } from "../../../Schema/Employee/Employee.Schema.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";
import { checkAdminPermission } from "../Admin.Utils.js";
import { objectId } from "../../../Validations/User/User.Validations.js";
import Joi from "joi";

const getAllTeachers = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_teachers");

  const { page = 1, limit = 10 } = req.query;

  const query = {};

  // Teacher specific filters can go here (e.g. subjects)

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      {
        path: "userId",
        select: "fullName email phone",
      },
      {
        path: "employeeId",
        select: "employeeCode department designation branches",
        populate: { path: "branches", select: "name" },
      },
    ],
    lean: true,
  };

  const skip = (options.page - 1) * options.limit;

  const teachers = await Teacher.find(query)
    .sort(options.sort)
    .skip(skip)
    .limit(options.limit)
    .populate(options.populate)
    .lean();

  const total = await Teacher.countDocuments(query);

  return successResponse(res, {
    message: "Teachers fetched successfully",
    data: {
      teachers,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        pages: Math.ceil(total / options.limit),
      },
    },
  });
});

const getTeacherProfile = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_teachers");

  const { teacherId } = req.params;
  const { error } = objectId.required().validate(teacherId);
  if (error) throw new ApiError(400, "Invalid Teacher ID");

  const teacher = await Teacher.findById(teacherId)
    .populate({
      path: "userId",
      select: "-password -__v",
    })
    .populate({
      path: "employeeId",
      populate: { path: "branches" },
    })
    .populate("subjects") // Assuming subjects is a reference
    .lean();

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return successResponse(res, {
    message: "Teacher profile fetched successfully",
    data: teacher,
  });
});

const updateTeacher = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_teachers");

  const { teacherId } = req.params;
  const { error: idError } = objectId.required().validate(teacherId);
  if (idError) throw new ApiError(400, "Invalid Teacher ID");

  const schema = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    experience: Joi.number().optional(),
    subjects: Joi.array().items(objectId).optional(),
  }).unknown(true);

  const { error, value } = schema.validate(req.body);
  if (error) throw new ApiError(400, "Validation failed", error.details);

  const teacher = await Teacher.findById(teacherId);
  if (!teacher) throw new ApiError(404, "Teacher not found");

  // Update User
  if (value.fullName || value.email || value.phone) {
    await User.findByIdAndUpdate(teacher.userId, {
      ...(value.fullName && { fullName: value.fullName }),
      ...(value.email && { email: value.email }),
      ...(value.phone && { phone: value.phone }),
    });
  }

  // Update Teacher
  if (value.experience) teacher.experience = value.experience;
  if (value.subjects) teacher.subjects = value.subjects;

  await teacher.save();

  return successResponse(res, {
    message: "Teacher updated successfully",
  });
});

export { getAllTeachers, getTeacherProfile, updateTeacher };
