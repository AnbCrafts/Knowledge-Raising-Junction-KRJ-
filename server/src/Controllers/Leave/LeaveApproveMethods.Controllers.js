import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Leave } from "../../Schema/Leave/Leave.Schema.js";
import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";
import { Student } from "../../Schema/Student/Student.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";

/* ==========================================================
   VALIDATION
========================================================== */
const approveValidation = Joi.object({
  adminId: Joi.string().length(24).required(),
  remarks: Joi.string().allow("").optional(),
});

/* ==========================================================
   APPROVE LEAVE CONTROLLER
========================================================== */

export const approveLeave = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  if (!leaveId || leaveId.length !== 24) {
    throw new ApiError(400, "Invalid leave ID");
  }

  const { error, value } = approveValidation.validate(req.body);

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

  const { adminId, remarks } = value;

  // 1️⃣ Find leave request
  const leave = await Leave.findById(leaveId);

  if (!leave) throw new ApiError(404, "Leave request not found");
  if (leave.status !== "PENDING")
    throw new ApiError(400, "Only pending leave can be approved");

  // 2️⃣ Approve leave
  leave.status = "APPROVED";
  leave.approvedBy = adminId;
  leave.approvalDate = new Date();
  leave.remarks = remarks || "";
  await leave.save();

  // 3️⃣ Mark attendance for each day
  const start = new Date(leave.startDate);
  const end = new Date(leave.endDate);

  const dates = [];
  const ONE_DAY = 24 * 60 * 60 * 1000;

  for (let d = start; d <= end; d = new Date(d.getTime() + ONE_DAY)) {
    dates.push(new Date(d));
  }

  const attendanceDocs = dates.map((day) => ({
    attendeeType: leave.applicantType,
    attendeeId: leave.applicantId,
    branch: leave.branch,
    batch: null, // batch leave me required nahi hota
    subject: null,
    date: day,
    status: "ON_LEAVE",
    markedBy: adminId,
    remarks: "Leave approved",
  }));

  await Attendance.insertMany(attendanceDocs);

  // 4️⃣ Add leaveRef in profile
  if (leave.applicantType === "STUDENT") {
    await Student.findByIdAndUpdate(leave.applicantId, {
      $addToSet: { leaveRef: leave._id },
    });
  }

  if (leave.applicantType === "TEACHER") {
    await Teacher.findByIdAndUpdate(leave.applicantId, {
      $addToSet: { leaveRef: leave._id },
    });
  }

  if (leave.applicantType === "EMPLOYEE") {
    await Employee.findByIdAndUpdate(leave.applicantId, {
      $addToSet: { leaveRef: leave._id },
    });
  }

  return successResponse(res, {
    message: "Leave approved successfully",
    leave,
    attendanceAddedForDays: dates.length,
  });
});
