import Joi from "joi";
import { deleteReasonSchema, objectId } from "../../Validations/Subject/Subject.Validations.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import mongoose from "mongoose";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";



const SubjectDeletionValidationSchema = Joi.object({

            deleteReason: deleteReasonSchema.required()
})

const softDeleteSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;
  const { deleteReason } = req.body;

  const { error } = objectId.required().validate(subjectId);
  if (error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const { error: bodyError } =
    SubjectDeletionValidationSchema.validate(req.body);

  if (bodyError) {
    throw new ApiError(400, bodyError.details[0].message);
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subject = await Subject.findOne({
      _id: subjectId,
      isActive: true
    }).session(session);

    if (!subject) {
      throw new ApiError(400, "Subject not found or already deleted");
    }

    const deletedAt = new Date();
    const deletedBy = req.user._id;

    await Subject.updateOne(
      { _id: subjectId },
      {
        isActive: false,
        deletedAt,
        deletedBy,
        deleteReason
      },
      { session }
    );

    await Teacher.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { session }
    );

    await Student.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { session }
    );

    await Batch.updateMany(
      { subjects: subjectId },
      { $pull: { subjects: subjectId } },
      { session }
    );

    const routines = await RoutineSlot.find(
      { subject: subjectId, isActive: true },
      { _id: 1, batches: 1 }
    ).session(session);

    if (routines.length) {
      await Batch.updateMany(
        { routines: { $in: routines.map(r => r._id) } },
        { $pull: { routines: { $in: routines.map(r => r._id) } } },
        { session }
      );

      await RoutineSlot.updateMany(
        { _id: { $in: routines.map(r => r._id) } },
        {
          $set: {
            isActive: false,
            inactiveReason: "Parent Subject Deleted"
          },
          $unset: {
            batches: ""
          }
        },
        { session }
      );
    }

    await Admin.updateMany(
      { managedSubjects: subjectId },
      { $pull: { managedSubjects: subjectId } },
      { session }
    );

    await session.commitTransaction();

    const admins = await Admin.find({ managedSubjects: subjectId }).select("userId");
    const teachers = await Teacher.find({ subjects: subjectId }).select("userId");
    const students = await Student.find({ subjects: subjectId }).select("userId");

    const notifications = [
      ...admins,
      ...teachers,
      ...students
    ].map(u => ({
      userId: u.userId,
      type: "SUBJECT_DEACTIVATED",
      message: "A subject associated with you has been removed.",
      meta: {
        subjectId,
        deletedAt
      }
    }));

    if (notifications.length) {
      await Notification.insertMany(notifications);
    }

    return successResponse(
      res,
      200,
      "Subject deleted successfully"
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});
const hardDeleteSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const { error } = objectId.required().validate(subjectId);
  if (error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subject = await Subject.findById(subjectId).session(session);

    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    if (subject.isActive) {
      throw new ApiError(
        400,
        "Subject must be soft deleted before hard delete"
      );
    }

    const routineExists = await RoutineSlot.exists({
      subject: subjectId
    }).session(session);

    if (routineExists) {
      throw new ApiError(
        400,
        "Cannot hard delete subject with existing routines"
      );
    }

    await Subject.deleteOne(
      { _id: subjectId },
      { session }
    );

    await session.commitTransaction();

    return successResponse(
      res,
      200,
      "Subject permanently deleted"
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});
const removeRoutineFromSubject = asyncHandler(async (req, res) => {
  const { subjectId, routineId } = req.params;

  const subjectIdValidation = objectId.required().validate(subjectId);
  if (subjectIdValidation.error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const routineIdValidation = objectId.required().validate(routineId);
  if (routineIdValidation.error) {
    throw new ApiError(400, "Invalid routine ID");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findOne(
      { _id: routineId, subject: subjectId },
      { batches: 1, teachers: 1 }
    ).session(session);

    if (!routine) {
      throw new ApiError(
        404,
        "Routine not found for the given subject"
      );
    }

    const batchIds = routine.batches || [];
    const teacherIds = routine.teachers || [];

    await Subject.updateOne(
      { _id: subjectId },
      { $pull: { routines: routineId } },
      { session }
    );

    if (batchIds.length) {
      await Batch.updateMany(
        { _id: { $in: batchIds } },
        { $pull: { routines: routineId } },
        { session }
      );
    }

    if (batchIds.length) {
      await RoutineSlot.updateOne(
        { _id: routineId },
        { $pull: { batches: { $in: batchIds } } },
        { session }
      );
    }

    if (teacherIds.length) {
      await Teacher.updateMany(
        { _id: { $in: teacherIds } },
        { $pull: { routines: routineId } },
        { session }
      );
    }

    await Student.updateMany(
      { subjects: subjectId },
      { $pull: { routines: routineId } },
      { session }
    );

    await session.commitTransaction();

    return successResponse(
      res,
      200,
      "Routine removed from subject successfully"
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});


export {softDeleteSubject,hardDeleteSubject,removeRoutineFromSubject}



