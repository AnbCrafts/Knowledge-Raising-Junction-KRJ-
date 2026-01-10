import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";

/* ======================================================
   VALIDATION FOR UPDATE
====================================================== */
const updateValidationSchema = Joi.object({
  status: Joi.string()
    .valid("PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE")
    .optional(),

  checkInTime: Joi.date().allow(null).optional(),
  checkOutTime: Joi.date().allow(null).optional(),

  remarks: Joi.string().allow("").optional(),
});

/* ======================================================
   UPDATE ATTENDANCE (PUT)
====================================================== */
export const updateAttendance = asyncHandler(async (req, res) => {
  const { attendanceId } = req.params;

  // 1️⃣ VALIDATE ID
  if (!attendanceId || attendanceId.length !== 24) {
    throw new ApiError(400, "Invalid attendance ID");
  }

  // 2️⃣ VALIDATE BODY
  const { error, value } = updateValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Invalid update data",
      error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  // 3️⃣ UPDATE RECORD
  const updated = await Attendance.findByIdAndUpdate(
    attendanceId,
    { $set: value },
    { new: true }
  )
    .populate("branch", "name branchCode")
    .populate("batch", "name code")
    .populate("subject", "name code")
    .lean();

  if (!updated) {
    throw new ApiError(404, "Attendance record not found");
  }

  // 4️⃣ RESPONSE
  return successResponse(res, {
    message: "Attendance updated successfully",
    data: updated,
  });
});
