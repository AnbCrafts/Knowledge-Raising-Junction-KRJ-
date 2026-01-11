import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../../Schema/Management/Student/Student.Schema.js";
import { AcademicProfile } from "../../../Schema/Management/AcademicDetails/AcademicProfile.Schema.js";
import { IDCard } from "../../../Schema/Management/IDCard/IDCard.Schema.js";
import { Branch } from "../../../Schema/Management/Branch/Branch.Schema.js";
import CounterSchema from "../../../Schema/Management/Counter/Counter.Schema.js";
import { Admin } from "../../../Schema/Management/Admin/Admin.Schema.js";

/* =======================
   JOI VALIDATION
======================= */
const admissionCreationValidationSchema = Joi.object({
  userId: Joi.string().required(),
  createdBy: Joi.string().required(),   // ✅ FIX ADDED

  fatherName: Joi.string().min(2).required(),
  motherName: Joi.string().min(2).required(),
  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .required(),
  gender: Joi.string().valid("Male", "Female", "Other").required(),
  dob: Joi.date().required(),

  address: Joi.string().required(),

  whatsapp: Joi.string().required(),
  parentMobile: Joi.string().required(),

  password: Joi.string().min(6).required(),

  academicYear: Joi.string().required(),
  currentClassYear: Joi.string().required(),
  board: Joi.string().required(),
  course: Joi.string().required(),
  medium: Joi.string().required(),
  previousAcademics: Joi.array().default([]),
  remarks: Joi.string().allow(""),

  branch: Joi.string().required(),
  assignedTeacher: Joi.array().items(Joi.string()).default([]),

  joiningDate: Joi.date().default(() => new Date()),
  leavingDate: Joi.date().allow(null),

  photo: Joi.string().allow("")
});

/* =======================
   CONTROLLER
======================= */
const addStudent = asyncHandler(async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    // 1️⃣ VALIDATION
    const { error, value } = admissionCreationValidationSchema.validate(
      req.body,
      { abortEarly: false, stripUnknown: true }
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
      userId,
      createdBy,     // ✅ FIX
      fatherName,
      motherName,
      bloodGroup,
      gender,
      dob,
      address,
      whatsapp,
      parentMobile,
      password,
      academicYear,
      currentClassYear,
      board,
      course,
      medium,
      previousAcademics,
      remarks,
      branch,
      assignedTeacher,
      joiningDate,
      leavingDate,
      photo,
    } = value;

    // 2️⃣ ADMIN CHECK
    const admin = await Admin.findById(createdBy);

    if (!admin) {
      throw new ApiError(403, "Invalid admin");
    }

    if (!admin.permissions || !admin.permissions.includes("manage_students")) {
      throw new ApiError(403, "Admin does not have permission to manage students");
    }

    // 3️⃣ DUPLICATE CHECK
    const exists = await Student.findOne({ userId }).session(session);
    if (exists) {
      throw new ApiError(409, "Student already exists");
    }

    // 4️⃣ HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5️⃣ CREATE STUDENT
    const [student] = await Student.create(
      [
        {
          userId,
          fatherName,
          motherName,
          bloodGroup,
          gender,
          dob,
          address,
          contact: { whatsapp, parentMobile },
          password: hashedPassword,
          branch,
          assignedTeacher,
          joiningDate,
          leavingDate,
          status: "ACTIVE",
          attendanceRef: [],
          leaveRef: [],
          testRecords: [],
          feeAccount: [],
          onlineCourses: [],
        },
      ],
      { session }
    );

    // 6️⃣ ACADEMIC PROFILE
    const [academicProfile] = await AcademicProfile.create(
      [
        {
          studentId: student._id,
          academicYear,
          currentClassYear,
          board,
          course,
          medium,
          previousAcademics,
          remarks,
          isActive: true,
        },
      ],
      { session }
    );

    // 7️⃣ ADMISSION NUMBER
    const year = new Date().getFullYear();
    const counter = await CounterSchema.findOneAndUpdate(
      { key: `STUDENT_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const admissionNumber = `KRJ/${year}/${String(counter.seq).padStart(
      4,
      "0"
    )}`;

    // 8️⃣ CREATE ID CARD
    const [idCard] = await IDCard.create(
      [
        {
          holderType: "STUDENT",
          holderId: student._id,
          idNumber: admissionNumber,
          branch,
          photo: photo || "/default-avatar.jpg",
          status: "ACTIVE",
        },
      ],
      { session }
    );

    // 9️⃣ LINK ALL
    student.academicProfile = academicProfile._id;
    student.idCard = idCard._id;
    await student.save({ session });

    await Branch.updateOne(
      { _id: branch },
      { $addToSet: { students: student._id } },
      { session }
    );

    // 🔟 COMMIT
    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Student admission completed successfully",
      data: {
        studentId: student._id,
        admissionNumber,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});

export default addStudent;
