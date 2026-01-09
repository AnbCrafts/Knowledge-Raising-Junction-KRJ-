import Joi from "joi";
import { batches, createdBy, description, name, objectId, routines, subjectInitials, teachers, type } from "../../Validations/Subject/Subject.Validations.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import mongoose from "mongoose";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { generateSubjectCode } from "../../Utility/Codes/SubjectCode.Utility.js";

 

const subjectValidationSchema = Joi.object({
    name : name.required(),
    description: description.optional(),
    type:type.required(),
    batches:batches.optional(),
    routines: routines.required(),
    teachers: teachers.optional(),
    initials : subjectInitials.required(),

    



})
const addRoutineToSubjectSchema = Joi.object({
    routines: routines.required()
})
const addTeacherToSubjectSchema = Joi.object({
    teachers: teachers.required()
})
const addBatchesToSubjectSchema = Joi.object({
    batches: batches.required()
})

 const createSubject = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const value = await subjectValidationSchema.validateAsync(req.body);
      const adminId = req.admin._id;
      const { error } = objectId.required().validate(adminId);
        
if (error) {
  throw new ApiError(400, "Invalid admin ID");
}

    const {
      name,
      description,
      type,
      batches = [],
      teachers = [],
      routines,
      initials
    } = value;

    const year = new Date().getFullYear();

    // 1️⃣ Generate subject code
    const subjectCode = await generateSubjectCode({
      year,
      initials,
      session
    });


   
    const [subject] = await Subject.create(
      [
        {
          name,
          description,
          type,
          batches,
          teachers,
          routines,
          createdBy:adminId,
          code:subjectCode
        },
      ],
      { session }
    );

    const subjectId = subject._id;

    
    if (batches.length > 0) {
      await Batch.updateMany(
        { _id: { $in: batches } },
        { $addToSet: { subjects: subjectId } },
        { session }
      );
    }

    
    if (teachers.length > 0) {
      await Teacher.updateMany(
        { _id: { $in: teachers } },
        { $addToSet: { subjects: subjectId } },
        { session }
      );
    }

 
    const occupiedSlots = await RoutineSlot.find(
  {
    _id: { $in: routines },
    subject: { $ne: null }
  },
  null,
  { session }
);

if (occupiedSlots.length > 0) {
  throw new ApiError(
    400,
    "Some routine slots are already assigned to a subject"
  );
}

await RoutineSlot.updateMany(
  { _id: { $in: routines } },
  { $set: { subject: subjectId } },
  { session }
);


    await session.commitTransaction();
    session.endSession();

    return successResponse(
      res,
      201,
      "Subject created successfully",
      subject
    );
  } catch (error) {
    if (error.isJoi) {
      throw new ApiError(
        400,
        err.details.map(d => d.message.replace(/"/g, "")).join(", ")
      );
    }
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});
 const addRoutineToSubject = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId } = req.params;

    // validate subjectId using your validator
    const { error: subjectErr } = objectId.required().validate(subjectId);
    if (subjectErr) {
      throw new ApiError(400, "Invalid subject ID");
    }

    const { routines } = await validateRequest(
      addRoutineToSubjectSchema,
      req.body
    );

    // 1️⃣ Ensure subject exists
    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    // 2️⃣ Validate routine slots exist
    const existingSlots = await RoutineSlot.find(
      { _id: { $in: routines } },
      "_id subject",
      { session }
    );

    if (existingSlots.length !== routines.length) {
      throw new ApiError(400, "One or more routine slots are invalid");
    }

    // 3️⃣ Filter free slots (partial success)
    const freeSlotIds = existingSlots
      .filter(slot => !slot.subject)
      .map(slot => slot._id);

    if (freeSlotIds.length === 0) {
      throw new ApiError(
        400,
        "All provided routine slots are already assigned to subjects"
      );
    }

    // 4️⃣ Assign subject to free routine slots
    await RoutineSlot.updateMany(
      { _id: { $in: freeSlotIds } },
      { $set: { subject: subjectId } },
      { session }
    );

    // 5️⃣ Update subject (avoid duplicates)
    await Subject.updateOne(
      { _id: subjectId },
      { $addToSet: { routines: { $each: freeSlotIds } } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, "Routines added to subject", {
      addedRoutines: freeSlotIds.length,
      skippedRoutines: routines.length - freeSlotIds.length
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
 const addTeachersToSubject = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId } = req.params;

    // validate subjectId using your validator
    const { error: subjectErr } = objectId.required().validate(subjectId);
    if (subjectErr) {
      throw new ApiError(400, "Invalid subject ID");
    }

    const { teachers } = await validateRequest(
      addTeacherToSubjectSchema,
      req.body
    );

    // 1️⃣ Ensure subject exists
    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    // 2️⃣ Fetch teachers
    const existingTeachers = await Teacher.find(
      { _id: { $in: teachers } },
      "_id",
      { session }
    );

    if (existingTeachers.length !== teachers.length) {
      throw new ApiError(400, "One or more teacher IDs are invalid");
    }

    const teacherIds = existingTeachers.map(t => t._id);

    // 3️⃣ Update subject → teachers
    await Subject.updateOne(
      { _id: subjectId },
      { $addToSet: { teachers: { $each: teacherIds } } },
      { session }
    );

    // 4️⃣ Update teachers → subjects
    await Teacher.updateMany(
      { _id: { $in: teacherIds } },
      { $addToSet: { subjects: subjectId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, "Teachers added to subject", {
      addedTeachers: teacherIds.length
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});
 const addBatchesToSubject = asyncHandler(async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { subjectId } = req.params;

    // validate subjectId
    const { error: subjectErr } = objectId.required().validate(subjectId);
    if (subjectErr) {
      throw new ApiError(400, "Invalid subject ID");
    }

    const { batches } = await validateRequest(
      addBatchesToSubjectSchema,
      req.body
    );

    // 1️⃣ Ensure subject exists
    const subject = await Subject.findById(subjectId).session(session);
    if (!subject) {
      throw new ApiError(404, "Subject not found");
    }

    // 2️⃣ Fetch batches
    const existingBatches = await Batch.find(
      { _id: { $in: batches } },
      "_id",
      { session }
    );

    if (existingBatches.length !== batches.length) {
      throw new ApiError(400, "One or more batch IDs are invalid");
    }

    const batchIds = existingBatches.map(b => b._id);

    // 3️⃣ Update subject → batches
    await Subject.updateOne(
      { _id: subjectId },
      { $addToSet: { batches: { $each: batchIds } } },
      { session }
    );

    // 4️⃣ Update batches → subjects
    await Batch.updateMany(
      { _id: { $in: batchIds } },
      { $addToSet: { subjects: subjectId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return successResponse(res, 200, "Batches added to subject", {
      addedBatches: batchIds.length
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
});


export {createSubject,addRoutineToSubject,addTeachersToSubject,addBatchesToSubject}

