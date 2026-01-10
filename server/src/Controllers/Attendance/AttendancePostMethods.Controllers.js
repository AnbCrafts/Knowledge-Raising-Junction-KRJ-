import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";
import { Student } from "../../Schema/Student/Student.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { Subject } from "../../Schema/Subject/Subject.Schema.js";

/* =====================================
   VALIDATION SCHEMA (INLINE)
===================================== */
const attendanceCreateValidation = Joi.object({
  attendeeType: Joi.string()
    .valid("STUDENT", "TEACHER", "EMPLOYEE")
    .required(),

  attendeeId: Joi.string().length(24).required(),

  branch: Joi.string().length(24).required(),

  batch: Joi.string().length(24).allow(null, "").optional(),

  subject: Joi.string().length(24).allow(null, "").optional(),

  date: Joi.date().required(),

  status: Joi.string()
    .valid("PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE")
    .required(),

  checkInTime: Joi.date().allow(null).optional(),
  checkOutTime: Joi.date().allow(null).optional(),

  markedBy: Joi.string().length(24).required(),

  remarks: Joi.string().allow("").optional(),
});

/* =====================================
   CREATE ATTENDANCE CONTROLLER
===================================== */
export const markAttendance = asyncHandler(async (req, res) => {
  let session;

  try {
    // 1️⃣ Validate body
    const { error, value } = attendanceCreateValidation.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation Failed",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const {
      attendeeType,
      attendeeId,
      branch,
      batch,
      subject,
      date,
      status,
      checkInTime,
      checkOutTime,
      markedBy,
      remarks,
    } = value;

    // 2️⃣ Start DB transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // 3️⃣ Validate branch
    const branchExists = await Branch.findById(branch).session(session);
    if (!branchExists) throw new ApiError(404, "Branch not found");

    // 4️⃣ Validate batch (if provided)
    if (batch) {
      const batchExists = await Batch.findById(batch).session(session);
      if (!batchExists) throw new ApiError(404, "Batch not found");
    }

    // 5️⃣ Validate subject (if provided)
    if (subject) {
      const subjectExists = await Subject.findById(subject).session(session);
      if (!subjectExists) throw new ApiError(404, "Subject not found");
    }

    // 6️⃣ Validate attendee based on type
    if (attendeeType === "STUDENT") {
      const studentExists = await Student.findById(attendeeId).session(session);
      if (!studentExists) throw new ApiError(404, "Student not found");
    }

    if (attendeeType === "TEACHER") {
      const teacherExists = await Teacher.findById(attendeeId).session(session);
      if (!teacherExists) throw new ApiError(404, "Teacher not found");
    }

    if (attendeeType === "EMPLOYEE") {
      const employeeExists = await Employee.findById(attendeeId).session(session);
      if (!employeeExists) throw new ApiError(404, "Employee not found");
    }

    // 7️⃣ Create attendance (schema prevents duplicate)
    const attendanceDocs = await Attendance.create(
      [
        {
          attendeeType,
          attendeeId,
          branch,
          batch: batch || null,
          subject: subject || null,
          date,
          status,
          checkInTime: checkInTime || null,
          checkOutTime: checkOutTime || null,
          markedBy,
          remarks: remarks || "",
        },
      ],
      { session }
    );

    const attendance = attendanceDocs[0];

    // 8️⃣ Commit
    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Attendance marked successfully",
      data: attendance,
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});
