import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import { batches, branches, classType, dateField, day, endTime, meetingLink, objectId, roomNumber, startTime, subject, teachers, topic } from "../../Validations/Routine/Routine.Validations.js";
import mongoose from "mongoose";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema";
import successResponse from "../../Utility/Response/SuccessResponse.Utility";


const RoutineValidationSchema = Joi.object({
  branches:branches.required(),        // ref: Branch
  batches: batches.required(),         // ref: Batch
  teachers: teachers.required(),        // ref: Teacher

  subject: objectId.required(),           // ref: Subject

  day: day.required(),
  startTime: startTime.required(),
  endTime: endTime.required(),

  specificDate: dateField.optional(),

  classType: classType.required(),
  roomNumber: roomNumber.optional(),
  meetingLink: meetingLink.optional(),
  topic: topic.optional(),

}
)
const assignTeacherToRoutineSchema = Joi.object({
  teachers: teachers.required()
})
const addRoutineToBatchSchema = Joi.object({
    batches: batches
})

 const createRoutine = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    
    const data = await validateRequest(RoutineValidationSchema, req.body);

    const {
      branches,
      batches,
      teachers,
      subject,
      day,
      startTime,
      endTime,
      specificDate,
      classType,
      roomNumber,
      meetingLink,
      topic
    } = data;

    
    const subjectExists = await Subject.findById(subject).session(session);
    if (!subjectExists) {
      throw new ApiError(404, "Subject not found");
    }

    const [
      branchCount,
      batchCount,
      teacherCount
    ] = await Promise.all([
      Branch.countDocuments({ _id: { $in: branches } }).session(session),
      Batch.countDocuments({ _id: { $in: batches } }).session(session),
      Teacher.countDocuments({ _id: { $in: teachers } }).session(session)
    ]);

    if (branchCount !== branches.length) {
      throw new ApiError(400, "Invalid branch IDs provided");
    }

    if (batchCount !== batches.length) {
      throw new ApiError(400, "Invalid batch IDs provided");
    }

    if (teacherCount !== teachers.length) {
      throw new ApiError(400, "Invalid teacher IDs provided");
    }

    const conflict = await RoutineSlot.findOne(
      {
        day,
        startTime,
        endTime,
        batches: { $in: batches },
        teachers: { $in: teachers },
        subject
      },
      null,
      { session }
    );

    if (conflict) {
      throw new ApiError(
        409,
        "Routine slot already exists for given time, batch, and teacher"
      );
    }

    const [routine] = await RoutineSlot.create(
      [
        {
          branches,
          batches,
          teachers,
          subject,
          day,
          startTime,
          endTime,
          specificDate,
          classType,
          roomNumber,
          meetingLink,
          topic,
          createdBy: req.admin._id // from adminAuth middleware
        }
      ],
      { session }
    );

await Subject.updateOne(
  { _id: subject },
  { $addToSet: { routines: routine._id } },
  { session }
);

await Batch.updateMany(
  { _id: { $in: batches } },
  { $addToSet: { routines: routine._id } },
  { session }
);

await Branch.updateMany(
  { _id: { $in: branches } },
  { $addToSet: { routines: routine._id } },
  { session }
);

await Teacher.updateMany(
  { _id: { $in: teachers } },
  { $addToSet: { routines: routine._id } },
  { session }
);


    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      201,
      "Routine created successfully",
      routine
    );

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
 const assignTeacherToRoutine = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { routineId } = req.params;

    // validate routineId
    const { error: routineErr } = objectId.required().validate(routineId);
    if (routineErr) {
      throw new ApiError(400, "Invalid routine ID");
    }

    const { teachers } = await validateRequest(
      assignTeacherToRoutineSchema,
      req.body
    );

    
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) {
      throw new ApiError(404, "Routine not found");
    }

    
    const existingTeachers = await Teacher.find(
      { _id: { $in: teachers } },
      "_id",
      { session }
    );

    if (existingTeachers.length !== teachers.length) {
      throw new ApiError(400, "One or more teacher IDs are invalid");
    }

    const teacherIds = existingTeachers.map(t => t._id);

    
    await RoutineSlot.updateOne(
      { _id: routineId },
      { $addToSet: { teachers: { $each: teacherIds } } },
      { session }
    );

    
    await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $addToSet: { routines: routineId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, "Teachers assigned to routine", {
      addedTeachers: teacherIds.length
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
 const addRoutineToBatch = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { routineId } = req.params;

    
    const { error: routineErr } = objectId.required().validate(routineId);
    if (routineErr) {
      throw new ApiError(400, "Invalid routine ID");
    }

    const { batches } = await validateRequest(
      addRoutineToBatchSchema,
      req.body
    );

    
    const routine = await RoutineSlot.findById(routineId).session(session);
    if (!routine) {
      throw new ApiError(404, "Routine not found");
    }

    
    const existingBatches = await Batch.find(
      { _id: { $in: batches } },
      "_id",
      { session }
    );

    if (existingBatches.length !== batches.length) {
      throw new ApiError(400, "One or more batch IDs are invalid");
    }

    const batchIds = existingBatches.map(b => b._id);

    
    await RoutineSlot.updateOne(
      { _id: routineId },
      { $addToSet: { batches: { $each: batchIds } } },
      { session }
    );

    
    await Batch.updateMany(
      { _id: { $in: batchIds } },
      { $addToSet: { routines: routineId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, "Routine added to batches", {
      routineId,
      batchesAdded: batchIds.length
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});



export {createRoutine,assignTeacherToRoutine,addRoutineToBatch}








