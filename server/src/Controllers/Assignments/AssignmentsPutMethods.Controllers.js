import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Assignment } from "../../Schema/Assignment/Assignment.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { Subject } from "../../Schema/Subject/Subject.Schema.js";

/* =============================
   UPDATE VALIDATION INLINE
   ============================= */
const assignmentUpdateValidation = Joi.object({
  title: Joi.string().min(2).optional(),
  description: Joi.string().allow("").optional(),
  dueDate: Joi.date().optional(),
  maxMarks: Joi.number().min(1).optional(),
  fileUrl: Joi.string().uri().allow("").optional(),

  batches: Joi.array().items(Joi.string().length(24)).optional(),
  subject: Joi.string().length(24).optional(),
});

/* =============================
   UPDATE ASSIGNMENT CONTROLLER
   ============================= */
export const updateAssignment = asyncHandler(async (req, res) => {
  const { assignmentId } = req.params;

  if (!assignmentId || assignmentId.length !== 24) {
    throw new ApiError(400, "Invalid Assignment ID");
  }

  // 1️⃣ Validate body
  const { error, value } = assignmentUpdateValidation.validate(req.body, {
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

  let session;

  try {
    // 2️⃣ Start transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // 3️⃣ Find Assignment
    const assignment = await Assignment.findById(assignmentId).session(session);
    if (!assignment) throw new ApiError(404, "Assignment not found");

    const oldBatches = assignment.batches.map((b) => b.toString());
    const newBatches = value.batches?.map((b) => b.toString());

    // 4️⃣ Validate Batches (if updated)
    if (newBatches) {
      const batchCount = await Batch.countDocuments({
        _id: { $in: newBatches },
      }).session(session);

      if (batchCount !== newBatches.length) {
        throw new ApiError(400, "Some batches are invalid");
      }
    }

    // 5️⃣ Validate Subject (if updated)
    if (value.subject) {
      const subjectExists = await Subject.findById(value.subject).session(
        session
      );
      if (!subjectExists) throw new ApiError(404, "Invalid subject");
    }

    // 6️⃣ Update Assignment fields
    Object.assign(assignment, value);
    await assignment.save({ session });

    // 7️⃣ If batches changed → update Batch.assignments[]
    if (newBatches) {
      // Remove from old batches
      await Batch.updateMany(
        { _id: { $in: oldBatches } },
        { $pull: { assignments: assignment._id } },
        { session }
      );

      // Add to new batches
      await Batch.updateMany(
        { _id: { $in: newBatches } },
        { $addToSet: { assignments: assignment._id } },
        { session }
      );
    }

    // 8️⃣ Commit transaction
    await session.commitTransaction();

    return successResponse(res, {
      message: "Assignment updated successfully",
      data: assignment,
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});
