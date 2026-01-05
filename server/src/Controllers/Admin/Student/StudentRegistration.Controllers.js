import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import Joi from "joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Models
import { User } from "../../../Schema/User/User.Schema.js";
import { Student } from "../../../Schema/Student/Student.Schema.js";
import { Branch } from "../../../Schema/Branch/Branch.Schema.js";
import { IDCard } from "../../../Schema/IDCard/IDCard.Schema.js";
import { AcademicProfile } from "../../../Schema/AcademicDetails/AcademicProfile.Schema.js";

// Utils
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";
import { checkAdminPermission } from "../Admin.Utils.js";

// Validations
import {
  fullName,
  email,
  phone,
  username,
  password,
  objectId,
} from "../../../Validations/User/User.Validations.js";

// ---------------- STUDENT REGISTRATION (ADMISSION) ----------------

const registerStudentValidationSchema = Joi.object({
  // User Basic Info
  userId: objectId.optional(),
  fullName: fullName.required(),
  email: email.optional(),
  username: username.required(),
  password: password.required(),
  phone: phone.optional(),

  // Student Specific
  fatherName: Joi.string().required(),
  motherName: Joi.string().optional(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  dob: Joi.date().required(),
  address: Joi.string().required(),
  whatsapp: Joi.string().optional(),
  parentMobile: Joi.string().optional(),

  // Organization
  branchId: objectId.required(),
  assignedTeacher: Joi.array().items(objectId).optional(),
  joiningDate: Joi.date().optional(),
  leavingDate: Joi.date().optional(),
  status: Joi.string().valid("ACTIVE", "LEFT", "INACTIVE").optional(),

  // Academic Profile
  academicYear: Joi.string().required(),
  currentClassYear: Joi.string().required(),
  board: Joi.string().optional(),
  course: Joi.string().optional(),
  medium: Joi.string().optional(),
  previousAcademics: Joi.array().optional(),
  remarks: Joi.string().optional(),

  // References (Optional)
  attendanceRef: Joi.array().items(objectId).optional(),
  leaveRef: Joi.array().items(objectId).optional(),
  testRecords: Joi.array().items(objectId).optional(),
  feeAccount: Joi.array().items(objectId).optional(),
  onlineCourses: Joi.array().items(objectId).optional(),

  // Photo
  photo: Joi.string().optional(),
}).unknown(true);

export const registerStudent = asyncHandler(async (req, res) => {
  // 1. Strict Admin Check
  await checkAdminPermission(req.user._id, "manage_students");

  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // 2. Validate Input
    const { error, value } = registerStudentValidationSchema.validate(
      req.body,
      {
        abortEarly: false,
        stripUnknown: true,
      }
    );

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const {
      fullName,
      email,
      username,
      password,
      phone,
      fatherName,
      motherName,
      bloodGroup,
      gender,
      dob,
      address,
      whatsapp,
      parentMobile,
      branchId,
      assignedTeacher,
      joiningDate,
      leavingDate,
      status,
      academicYear,
      currentClassYear,
      board,
      course,
      medium,
      previousAcademics,
      remarks,
      attendanceRef,
      leaveRef,
      testRecords,
      feeAccount,
      onlineCourses,
      photo,
    } = value;

    // 3. Check Existing User
    const existingUser = await User.findOne({
      $or: [{ username }, ...(email ? [{ email }] : [])],
    }).session(session);
    if (existingUser) {
      throw new ApiError(
        409,
        "User with this username or email already exists"
      );
    }

    // 4. Create User
    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT) || 10;
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

    const newUsers = await User.create(
      [
        {
          fullName,
          email,
          username,
          password: hashedPass,
          phone: phone || parentMobile,
          role: "STUDENT",
          createdBy: req.user._id,
        },
      ],
      { session }
    );

    const createdUser = newUsers[0];

    // 5. Create Student Profile
    const newStudents = await Student.create(
      [
        {
          userId: createdUser._id,
          fatherName,
          motherName,
          bloodGroup,
          gender,
          dob,
          address,
          contact: { whatsapp, parentMobile },
          password: hashedPass,
          branch: branchId,
          assignedTeacher: assignedTeacher || [],
          joiningDate: joiningDate || Date.now(),
          leavingDate,
          status: status || "ACTIVE",
          attendanceRef: attendanceRef || [],
          leaveRef: leaveRef || [],
          testRecords: testRecords || [],
          feeAccount: feeAccount || [],
          onlineCourses: onlineCourses || [],
        },
      ],
      { session }
    );

    const savedStudent = newStudents[0];

    // 6. Create Academic Profile
    const newProfiles = await AcademicProfile.create(
      [
        {
          studentId: savedStudent._id,
          academicYear,
          currentClassYear,
          board,
          course,
          medium,
          previousAcademics: previousAcademics || [],
          isActive: true,
          remarks: remarks || "",
        },
      ],
      { session }
    );

    const savedProfile = newProfiles[0];

    // 7. Generate ID Card
    const currentYear = new Date().getFullYear();
    // Count students registered in the current year
    const count = await Student.countDocuments({
      createdAt: {
        $gte: new Date(`${currentYear}-01-01`),
        $lte: new Date(`${currentYear}-12-31`),
      },
    }).session(session);

    const nextSequence = (count + 1).toString().padStart(4, "0");
    const customAdmissionId = `KRJ/${currentYear}/${nextSequence}`;

    const newIdCards = await IDCard.create(
      [
        {
          holderType: "STUDENT",
          holderId: savedStudent._id,
          idNumber: customAdmissionId,
          branch: branchId,
          photo: photo || "./default-avar.jpg",
          status: "ACTIVE",
        },
      ],
      { session }
    );

    const savedIdCard = newIdCards[0];

    // 8. Link Profile and ID Card to Student
    savedStudent.academicProfile = savedProfile._id;
    savedStudent.idCard = savedIdCard._id;
    await savedStudent.save({ session });

    // 9. Update Branch
    if (branchId) {
      await Branch.findByIdAndUpdate(
        branchId,
        {
          $addToSet: { students: savedStudent._id },
        },
        { session }
      );
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Student admitted successfully",
      data: {
        studentId: savedStudent._id,
        userId: createdUser._id,
        admissionNumber: customAdmissionId,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});
