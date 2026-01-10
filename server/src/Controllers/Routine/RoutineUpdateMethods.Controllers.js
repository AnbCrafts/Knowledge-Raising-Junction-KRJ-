import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility";
import ApiError from "../../Utility/Response/ErrorResponse.Utility";
import mongoose from "mongoose";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema";
import successResponse from "../../Utility/Response/SuccessResponse.Utility";
import Teacher from "../../Schema/Teacher/Teacher.Schema";
import { Batch } from "../../Schema/Batch/Batch.Schema";
import { Subject } from "../../Schema/Subjects/Subject.Schema";
import { batches, day, endTime, startTime, subject, teachers } from "../../Validations/Routine/Routine.Validations";

const updateRoutineSchema = Joi.object({
    subject : subject.optional(),
    batches : batches.optional(),
    teachers : teachers.optional(),
    day : day.optional(),
    startTime : startTime.optional(),
    endTime : endTime.optional()

})

const updateRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const adminId = req.user._id;

  const { error, value } = updateRoutineSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });
  if (error) {
    throw new ApiError(400, error.details.map(d => d.message).join(", "));
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) throw new ApiError(404, "Routine not found");
    if (!routine.isActive) throw new ApiError(400, "Cannot update deleted routine");

    const newSubject = value.subject ?? routine.subject;
    const newBatches = value.batches ?? routine.batches;
    const newTeachers = value.teachers ?? routine.teachers;
    const newDay = value.day ?? routine.day;
    const newStart = value.startTime ?? routine.startTime;
    const newEnd = value.endTime ?? routine.endTime;

    if (newStart >= newEnd) {
      throw new ApiError(400, "Invalid time range");
    }

    const batchConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: newDay,
      batches: { $in: newBatches },
      startTime: { $lt: newEnd },
      endTime: { $gt: newStart }
    }).session(session);

    if (batchConflict) {
      return res.status(409).json({
        success: false,
        type: "BATCH_CONFLICT",
        conflictedBatch: batchConflict.batches,
        conflictedRoutine: batchConflict._id
      });
    }

    const teacherConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: newDay,
      teachers: { $in: newTeachers },
      startTime: { $lt: newEnd },
      endTime: { $gt: newStart }
    }).session(session);

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        type: "TEACHER_CONFLICT",
        conflictedTeacher: teacherConflict.teachers,
        conflictedRoutine: teacherConflict._id
      });
    }

    const subjectConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      subject: newSubject,
      day: newDay,
      batches: { $in: newBatches },
      startTime: { $lt: newEnd },
      endTime: { $gt: newStart }
    }).session(session);

    if (subjectConflict) {
      return res.status(409).json({
        success: false,
        type: "SUBJECT_CONFLICT",
        conflictedSubject: newSubject,
        conflictedBatch: subjectConflict.batches,
        conflictedRoutine: subjectConflict._id
      });
    }

    const oldBatches = routine.batches.map(String);
    const newBatchIds = newBatches.map(String);
    const batchesToAdd = newBatchIds.filter(b => !oldBatches.includes(b));
    const batchesToRemove = oldBatches.filter(b => !newBatchIds.includes(b));

    const oldTeachers = routine.teachers.map(String);
    const newTeacherIds = newTeachers.map(String);
    const teachersToAdd = newTeacherIds.filter(t => !oldTeachers.includes(t));
    const teachersToRemove = oldTeachers.filter(t => !newTeacherIds.includes(t));

    if (routine.subject.toString() !== newSubject.toString()) {
      await Subject.updateOne(
        { _id: routine.subject },
        { $pull: { routines: routine._id } },
        { session }
      );

      await Subject.updateOne(
        { _id: newSubject },
        { $addToSet: { routines: routine._id } },
        { session }
      );
    }

    if (batchesToRemove.length) {
      await Batch.updateMany(
        { _id: { $in: batchesToRemove } },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    if (batchesToAdd.length) {
      await Batch.updateMany(
        { _id: { $in: batchesToAdd } },
        { $addToSet: { routines: routine._id } },
        { session }
      );
    }

    if (teachersToRemove.length) {
      await Teacher.updateMany(
        { _id: { $in: teachersToRemove } },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    if (teachersToAdd.length) {
      await Teacher.updateMany(
        { _id: { $in: teachersToAdd } },
        { $addToSet: { routines: routine._id } },
        { session }
      );
    }

    routine.subject = newSubject;
    routine.batches = newBatches;
    routine.teachers = newTeachers;
    routine.day = newDay;
    routine.startTime = newStart;
    routine.endTime = newEnd;
    routine.updatedBy = adminId;
    routine.updatedAt = new Date();

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Routine updated successfully",
      data: routine
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const restoreRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const adminId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);

    if (!routine) {
      throw new ApiError(404, "Routine not found");
    }

    if (routine.isActive) {
      throw new ApiError(400, "Routine is already active");
    }

    routine.isActive = true;
    routine.deletedAt = null;
    routine.deletedBy = null;
    routine.deleteReason = null;
    routine.updatedBy = adminId;
    routine.updatedAt = new Date();

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Routine restored as empty shell",
      data: {
        routineId: routine._id,
        subject: null,
        batches: [],
        teachers: []
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const PatchSubjectToARoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const { subjectId } = req.body;
  const adminId = req.user._id;

  if (!subjectId) {
    throw new ApiError(400, "subjectId is required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) throw new ApiError(404, "Routine not found");
    if (!routine.isActive) throw new ApiError(400, "Routine is inactive");

    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) throw new ApiError(404, "Subject not found");

    const newBatches = subject.batches || [];
    const newTeachers = subject.teachers || [];

    if (routine.subject && routine.subject.toString() !== subjectId) {
      const batchConflict = await RoutineSlot.findOne({
        _id: { $ne: routineId },
        isActive: true,
        day: routine.day,
        batches: { $in: newBatches },
        startTime: { $lt: routine.endTime },
        endTime: { $gt: routine.startTime }
      }).session(session);

      if (batchConflict) {
        return res.status(409).json({
          success: false,
          type: "BATCH_CONFLICT",
          conflictedBatch: batchConflict.batches,
          conflictedRoutine: batchConflict._id
        });
      }

      const teacherConflict = await RoutineSlot.findOne({
        _id: { $ne: routineId },
        isActive: true,
        day: routine.day,
        teachers: { $in: newTeachers },
        startTime: { $lt: routine.endTime },
        endTime: { $gt: routine.startTime }
      }).session(session);

      if (teacherConflict) {
        return res.status(409).json({
          success: false,
          type: "TEACHER_CONFLICT",
          conflictedTeacher: teacherConflict.teachers,
          conflictedRoutine: teacherConflict._id
        });
      }

      const oldSubjectId = routine.subject;
      const oldBatches = routine.batches;
      const oldTeachers = routine.teachers;

      await Subject.updateOne(
        { _id: oldSubjectId },
        { $pull: { routines: routine._id } },
        { session }
      );

      await Batch.updateMany(
        { _id: { $in: oldBatches } },
        { $pull: { routines: routine._id } },
        { session }
      );

      await Teacher.updateMany(
        { _id: { $in: oldTeachers } },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    await Subject.updateOne(
      { _id: subjectId },
      { $addToSet: { routines: routine._id } },
      { session }
    );

    await Batch.updateMany(
      { _id: { $in: newBatches } },
      { $addToSet: { routines: routine._id } },
      { session }
    );

    await Teacher.updateMany(
      { _id: { $in: newTeachers } },
      { $addToSet: { routines: routine._id } },
      { session }
    );

    const previousState = {
      subject: routine.subject,
      batches: routine.batches,
      teachers: routine.teachers
    };

    routine.subject = subjectId;
    routine.batches = newBatches;
    routine.teachers = newTeachers;
    routine.updatedBy = adminId;
    routine.updatedAt = new Date();

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Subject patched to routine successfully",
      data: {
        previous: previousState,
        current: {
          subject: subjectId,
          batches: newBatches,
          teachers: newTeachers
        }
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const patchTeacherToRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const { teachers } = req.body;
  const adminId = req.user._id;

  if (!Array.isArray(teachers) || !teachers.length) {
    throw new ApiError(400, "teachers array is required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) throw new ApiError(404, "Routine not found");
    if (!routine.isActive) throw new ApiError(400, "Routine is inactive");

    if (!routine.subject) {
      throw new ApiError(400, "Assign subject before assigning teachers");
    }

    const newTeacherIds = teachers.map(String);
    const oldTeacherIds = routine.teachers.map(String);

    const teachersToAdd = newTeacherIds.filter(t => !oldTeacherIds.includes(t));
    const teachersToRemove = oldTeacherIds.filter(t => !newTeacherIds.includes(t));

    if (!teachersToAdd.length && !teachersToRemove.length) {
      await session.abortTransaction();
      session.endSession();

      return successResponse(res, {
        message: "Teachers already assigned",
        data: {
          teachers: routine.teachers
        }
      });
    }

    const teacherConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: routine.day,
      teachers: { $in: newTeacherIds },
      startTime: { $lt: routine.endTime },
      endTime: { $gt: routine.startTime }
    }).session(session);

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        type: "TEACHER_CONFLICT",
        conflictedTeacher: teacherConflict.teachers,
        conflictedRoutine: teacherConflict._id
      });
    }

    const batchConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: routine.day,
      batches: { $in: routine.batches },
      startTime: { $lt: routine.endTime },
      endTime: { $gt: routine.startTime }
    }).session(session);

    if (batchConflict) {
      return res.status(409).json({
        success: false,
        type: "BATCH_CONFLICT",
        conflictedBatch: batchConflict.batches,
        conflictedRoutine: batchConflict._id
      });
    }

    if (teachersToRemove.length) {
      await Teacher.updateMany(
        { _id: { $in: teachersToRemove } },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    if (teachersToAdd.length) {
      await Teacher.updateMany(
        { _id: { $in: teachersToAdd } },
        { $addToSet: { routines: routine._id } },
        { session }
      );
    }

    const previousTeachers = routine.teachers;

    routine.teachers = newTeacherIds;
    routine.updatedBy = adminId;
    routine.updatedAt = new Date();

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Teachers patched to routine successfully",
      data: {
        previous: previousTeachers,
        current: newTeacherIds
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});

const patchBatchesToRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;
  const { batches } = req.body;
  const adminId = req.user._id;

  if (!Array.isArray(batches) || !batches.length) {
    throw new ApiError(400, "batches array is required");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) throw new ApiError(404, "Routine not found");
    if (!routine.isActive) throw new ApiError(400, "Routine is inactive");

    if (!routine.subject) {
      throw new ApiError(400, "Assign subject before assigning batches");
    }

    if (!routine.teachers || !routine.teachers.length) {
      throw new ApiError(400, "Assign teachers before assigning batches");
    }

    const newBatchIds = batches.map(String);
    const oldBatchIds = routine.batches.map(String);

    const batchesToAdd = newBatchIds.filter(b => !oldBatchIds.includes(b));
    const batchesToRemove = oldBatchIds.filter(b => !newBatchIds.includes(b));

    if (!batchesToAdd.length && !batchesToRemove.length) {
      await session.abortTransaction();
      session.endSession();

      return successResponse(res, {
        message: "Batches already assigned",
        data: {
          batches: routine.batches
        }
      });
    }

    const batchConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: routine.day,
      batches: { $in: newBatchIds },
      startTime: { $lt: routine.endTime },
      endTime: { $gt: routine.startTime }
    }).session(session);

    if (batchConflict) {
      return res.status(409).json({
        success: false,
        type: "BATCH_CONFLICT",
        conflictedBatch: batchConflict.batches,
        conflictedRoutine: batchConflict._id
      });
    }

    const teacherConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      day: routine.day,
      teachers: { $in: routine.teachers },
      startTime: { $lt: routine.endTime },
      endTime: { $gt: routine.startTime }
    }).session(session);

    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        type: "TEACHER_CONFLICT",
        conflictedTeacher: teacherConflict.teachers,
        conflictedRoutine: teacherConflict._id
      });
    }

    const subjectConflict = await RoutineSlot.findOne({
      _id: { $ne: routineId },
      isActive: true,
      subject: routine.subject,
      day: routine.day,
      batches: { $in: newBatchIds },
      startTime: { $lt: routine.endTime },
      endTime: { $gt: routine.startTime }
    }).session(session);

    if (subjectConflict) {
      return res.status(409).json({
        success: false,
        type: "SUBJECT_CONFLICT",
        conflictedBatch: subjectConflict.batches,
        conflictedRoutine: subjectConflict._id
      });
    }

    if (batchesToRemove.length) {
      await Batch.updateMany(
        { _id: { $in: batchesToRemove } },
        { $pull: { routines: routine._id } },
        { session }
      );
    }

    if (batchesToAdd.length) {
      await Batch.updateMany(
        { _id: { $in: batchesToAdd } },
        { $addToSet: { routines: routine._id } },
        { session }
      );
    }

    const previousBatches = routine.batches;

    routine.batches = newBatchIds;
    routine.updatedBy = adminId;
    routine.updatedAt = new Date();

    await routine.save({ session });

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, {
      message: "Batches patched to routine successfully",
      data: {
        previous: previousBatches,
        current: newBatchIds
      }
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});





export {updateRoutine,restoreRoutine,PatchSubjectToARoutine,patchTeacherToRoutine,patchBatchesToRoutine}


