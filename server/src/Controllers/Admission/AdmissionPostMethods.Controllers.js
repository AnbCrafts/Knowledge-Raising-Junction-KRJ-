import mongoose from "mongoose";
import Joi from "joi";
import bcrypt from "bcryptjs";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../Schema/Student/Student.Schema.js";
import { AcademicProfile } from "../../Schema/AcademicDetails/AcademicProfile.Schema.js";
import { IDCard } from "../../Schema/IDCard/IDCard.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import CounterSchema from "../../Schema/Counter/Counter.Schema.js";
import { Admin } from "../../Schema/Admin/Admin.Schema.js";

/* =======================
   JOI VALIDATION (INLINE)
   ======================= */
const admissionCreationValidationSchema = Joi.object({
  userId: Joi.string().required(),

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

// CONTROLLER
//    ======================= */
const addStudent = asyncHandler(async (req, res) => {
  let session;
    try {
        // 1️⃣ START TRANSACTION
    session = await mongoose.startSession();
    session.startTransaction();

          // 2️⃣ VALIDATION
    const { error, value } =
      admissionCreationValidationSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map(d => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }
    const {
      userId,
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

    const admin = await Admin.findById(createdBy);
    
    if (!admin) {
      throw new ApiError(403, "Invalid admin");
    }
    
    if (
      !admin.permissions ||
      !admin.permissions.includes("manage_employees")
    ) {
      throw new ApiError(
        403,
        "Admin does not have permission to manage employees"
      );
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
      [{
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
      }],
      { session }
    );
    // 6️⃣ CREATE ACADEMIC PROFILE
    const [academicProfile] = await AcademicProfile.create(
      [{
        studentId: student._id,
        academicYear,
        currentClassYear,
        board,
        course,
        medium,
        previousAcademics,
        remarks,
        isActive: true,
      }],
      { session }
    );
    // 7️⃣ ADMISSION NUMBER (COUNTER – SAFE)
    const year = new Date().getFullYear();

    const counter = await CounterSchema.findOneAndUpdate(
      { key: `STUDENT_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const admissionNumber =
      `KRJ/${year}/${String(counter.seq).padStart(4, "0")}`;

    // 8️⃣ CREATE ID CARD
    const [idCard] = await IDCard.create(
      [{
        holderType: "STUDENT",
        holderId: student._id,
        idNumber: admissionNumber,
        branch,
        photo: photo || "/default-avatar.jpg",
        status: "ACTIVE",
      }],
      { session }
    );
     // 9️⃣ LINKING
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
        password,

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
























