import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Leave } from "../../Schema/Leave/Leave.Schema.js";
import { Student } from "../../Schema/Student/Student.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";

/* ==========================================================
   VALIDATION SCHEMA
========================================================== */
const leaveApplyValidation = Joi.object({
  applicantId: Joi.string().length(24).required(),
  applicantType: Joi.string()
    .valid("STUDENT", "TEACHER", "EMPLOYEE")
    .required(),
  branch: Joi.string().length(24).required(),

  startDate: Joi.date().required(),
  endDate: Joi.date().required(),

  reason: Joi.string().min(3).required(),
  remarks: Joi.string().allow("").optional(),
});

/* ==========================================================
   CREATE LEAVE REQUEST (APPLY)
========================================================== */

export const applyForLeave = asyncHandler(async (req, res) => {
  const { error, value } = leaveApplyValidation.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

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
    applicantId,
    applicantType,
    branch,
    startDate,
    endDate,
    reason,
    remarks,
  } = value;

  // Check branch
  const branchExists = await Branch.findById(branch);
  if (!branchExists) throw new ApiError(404, "Branch not found");

  // Validate applicant based on type
  if (applicantType === "STUDENT") {
    const student = await Student.findById(applicantId);
    if (!student) throw new ApiError(404, "Student not found");
  }

  if (applicantType === "TEACHER") {
    const teacher = await Teacher.findById(applicantId);
    if (!teacher) throw new ApiError(404, "Teacher not found");
  }

  if (applicantType === "EMPLOYEE") {
    const employee = await Employee.findById(applicantId);
    if (!employee) throw new ApiError(404, "Employee not found");
  }

  // Date range validation
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new ApiError(400, "Start date cannot be after end date");
  }

  // Duration in days
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const durationDays = Math.floor((end - start) / ONE_DAY) + 1;

  // Create new leave
  const leave = await Leave.create({
    applicantId,
    applicantType,
    branch,
    startDate: start,
    endDate: end,
    durationDays,
    reason,
    remarks,
    status: "PENDING",
  });

  return successResponse(res, {
    message: "Leave request submitted successfully",
    data: leave,
  });
});
