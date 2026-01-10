import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Leave } from "../../Schema/Leave/Leave.Schema.js";

/* ==========================================================
   VALIDATION
========================================================== */
const rejectValidation = Joi.object({
  adminId: Joi.string().length(24).required(),
  remarks: Joi.string().allow("").optional(),
});

/* ==========================================================
   REJECT LEAVE CONTROLLER
========================================================== */

export const rejectLeave = asyncHandler(async (req, res) => {
  const { leaveId } = req.params;

  // Validate ID
  if (!leaveId || leaveId.length !== 24) {
    throw new ApiError(400, "Invalid leave ID");
  }

  // Validate body
  const { error, value } = rejectValidation.validate(req.body, {
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

  const { adminId, remarks } = value;

  // 1️⃣ Find leave request
  const leave = await Leave.findById(leaveId);

  if (!leave) throw new ApiError(404, "Leave request not found");
  if (leave.status !== "PENDING")
    throw new ApiError(400, "Only pending leave can be rejected");

  // 2️⃣ Reject leave
  leave.status = "REJECTED";
  leave.approvedBy = adminId;
  leave.approvalDate = new Date();
  leave.remarks = remarks || "";
  await leave.save();

  // 3️⃣ No attendance creation for rejected leave

  return successResponse(res, {
    message: "Leave rejected successfully",
    data: leave,
  });
});
