import Joi from "joi";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import { deleteReasonSchema } from "../../Validations/Subject/Subject.Validations.js";


const softDeleteRoutineSchema = Joi.object({
    deleteReason : deleteReasonSchema
})

const softDeleteRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const adminId = req.user._id;

  const { error, value } = softDeleteRoutineSchema.validate(req.body);
  if (error) {
    throw new ApiError(400, error.details[0].message);
  }

  const { deleteReason } = value;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);

    if (!routine) {
      throw new ApiError(404, "Routine not found");
    }

    if (!routine.isActive) {
      throw new ApiError(400, "Routine already deleted");
    }

    const affectedSubjects = routine.subject ? [routine.subject] : [];
    const affectedBatches = [...routine.batches];
    const affectedTeachers = [...routine.teachers];

    if (affectedSubjects.length) {
      await Subject.updateOne(
        { _id: routine.subject },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    await Batch.updateMany(
      { _id: { $in: affectedBatches } },
      { $pull: { routines: routine._id } },
      { session }
    );

    await Teacher.updateMany(
      { _id: { $in: affectedTeachers } },
      { $pull: { routines: routine._id } },
      { session }
    );

    routine.subject = null;
    routine.batches = [];
    routine.teachers = [];
    routine.isActive = false;
    routine.deletedAt = new Date();
    routine.deletedBy = adminId;
    routine.deleteReason = deleteReason;

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Routine deleted successfully",
      data: {
        routineId: routine._id,
        affectedSubjects,
        affectedBatches,
        affectedTeachers
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
const hardDeleteRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);

    if (!routine) {
      throw new ApiError(404, "Routine not found");
    }

    if (routine.isActive) {
      throw new ApiError(400, "Routine must be soft deleted before hard delete");
    }

    await RoutineSlot.deleteOne({ _id: routineId }, { session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Routine hard deleted successfully",
      data: {
        routineId
      }
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

export {softDeleteRoutine,hardDeleteRoutine}

