import mongoose from "mongoose";
import Joi from "joi";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Assignment } from "../../Schema/Assignment/Assignment.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { Subject } from "../../Schema/Subject/Subject.Schema.js";

/* ============================
   VALIDATION SCHEMA
   ============================ */
const assignmentCreateValidation = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().allow(""),

  batches: Joi.array().items(Joi.string().length(24)).min(1).required(),
  subject: Joi.string().length(24).required(),

  createdBy: Joi.string().length(24).required(),

  dueDate: Joi.date().required(),
  maxMarks: Joi.number().min(1).default(100),

  fileUrl: Joi.string().uri().allow(""),
});

/* ============================
   CREATE ASSIGNMENT CONTROLLER
   ============================ */
export const createAssignment = asyncHandler(async (req, res) => {
  let session;

  try {
    // 1️⃣ Validate body
    const { error, value } = assignmentCreateValidation.validate(req.body, {
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
      title,
      description,
      batches,
      subject,
      createdBy,
      dueDate,
      maxMarks,
      fileUrl,
    } = value;

    // 2️⃣ Start DB transaction
    session = await mongoose.startSession();
    session.startTransaction();

    // 3️⃣ Verify Teacher
    const teacher = await Teacher.findById(createdBy).session(session);
    if (!teacher) throw new ApiError(404, "Teacher not found");

    // 4️⃣ Verify Subject
    const subjectExists = await Subject.findById(subject).session(session);
    if (!subjectExists) throw new ApiError(404, "Subject not found");

    // 5️⃣ Verify Batches
    const batchCount = await Batch.countDocuments({ _id: { $in: batches } });
    if (batchCount !== batches.length) {
      throw new ApiError(400, "Some batches are invalid");
    }

    // 6️⃣ Create Assignment
    const assignmentDocs = await Assignment.create(
      [
        {
          title,
          description,
          batches,
          subject,
          createdBy,
          dueDate,
          maxMarks,
          FileUrl: fileUrl || "",
        },
      ],
      { session }
    );

    const assignment = assignmentDocs[0];

    if (!assignment) {
      throw new ApiError(500, "Failed to create assignment");
    }

    // 7️⃣ Add to Teacher.assignments[]
    await Teacher.updateOne(
      { _id: createdBy },
      { $addToSet: { assignments: assignment._id } },
      { session }
    );

    // 8️⃣ (Optional) Add assignment to batches
    await Batch.updateMany(
      { _id: { $in: batches } },
      { $addToSet: { assignments: assignment._id } },
      { session }
    );

    // 9️⃣ Commit Transaction
    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Assignment created successfully",
      data: assignment,
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});
