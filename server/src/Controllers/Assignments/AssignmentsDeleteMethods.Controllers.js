import Joi from "joi";
import mongoose from "mongoose";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Assignment, Submission } from "../../Schema/Assignment/Assignment.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";

/* ============================
   VALIDATION INLINE
   ============================ */
const assignmentDeleteParamSchema = Joi.object({
  assignmentId: Joi.string().length(24).required(),
});

/* ============================
   DELETE ASSIGNMENT
   ============================ */
export const deleteAssignment = asyncHandler(async (req, res) => {
  // 1️⃣ Validate Params
  const { error } = assignmentDeleteParamSchema.validate(req.params);

  if (error) {
    throw new ApiError(400, "Invalid Assignment ID");
  }

  const { assignmentId } = req.params;

  let session;

  try {
    // 2️⃣ Start Transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // 3️⃣ Find Assignment
    const assignment = await Assignment.findById(assignmentId).session(session);

    if (!assignment) {
      throw new ApiError(404, "Assignment not found");
    }

    const teacherId = assignment.createdBy;
    const batchIds = assignment.batches;

    // 4️⃣ Delete ALL submissions for this assignment
    await Submission.deleteMany({ assignment: assignmentId }).session(session);

    // 5️⃣ Remove assignment from Teacher.assignments[]
    await Teacher.updateOne(
      { _id: teacherId },
      { $pull: { assignments: assignment._id } },
      { session }
    );

    // 6️⃣ Remove assignment from Batch.assignments[]
    await Batch.updateMany(
      { _id: { $in: batchIds } },
      { $pull: { assignments: assignment._id } },
      { session }
    );

    // 7️⃣ Delete Assignment itself
    await Assignment.findByIdAndDelete(assignmentId).session(session);

    // 8️⃣ Commit Transaction
    await session.commitTransaction();

    return successResponse(res, {
      message: "Assignment deleted successfully",
      data: { assignmentId },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});
