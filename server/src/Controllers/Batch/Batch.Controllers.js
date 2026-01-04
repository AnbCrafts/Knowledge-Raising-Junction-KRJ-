import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import {
  objectId,
  dateField,
  booleanField,  
  positiveNumber,
  name,
  code as batchCode,
  startDate,
  endDate,
  mentors,
  studentCapacity,
  currentStudentCount,
  teacherCapacity,
  currentTeacherCount,
  isActive,
  subjects,
  routine,
  assignments,
  batch,
  subject,
  primaryTeacher,
  syllabusCompletionPercentage,
  status,
  routineSlot,
  assignmentBatch,
  createdBy,
  branches,
  students
}  from "../../Validations/Batch/Batch.Validations.js";
import { Admin } from "../../Schema/Admin/Admin.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import mongoose from "mongoose";
import { Student } from "../../Schema/Student/Student.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";




const BatchValidationSchema = Joi.object({
  branches: branches.required(),
  name: name.required(),
  createdBy:createdBy.required(),
  

  startDate: startDate.required(),
  endDate: endDate.optional(),

  mentors: mentors.optional(),
  students:students.optional(),
  studentCapacity: studentCapacity.required(),
  

  teacherCapacity: teacherCapacity.required(),


  isActive: isActive.optional(),

  subjects: subjects.optional(),
  routine: routine.optional(),
 
});

const addStudentValidationSchema = Joi.object({
  students: students.min(1).required(),
  batchId: objectId.required(),
  adminId: objectId.required(),
});

const addTeacherValidationSchema = Joi.object({
  mentors: mentors.min(1).required(),
  batchId: objectId.required(),
  adminId: objectId.required(),
});

const addRoutineValidationSchema = Joi.object({
  routine: routine.min(1).required(),
  batchId: objectId.required(),
  adminId: objectId.required(),
});

const addSubjectValidationSchema = Joi.object({
  subjects: subjects.min(1).required(),
  batchId: objectId.required(),
  adminId: objectId.required(),
});



const createBatch = asyncHandler(async(req,res)=>{
          let session;
          try {

             session = await mongoose.startSession();
  session.startTransaction();

            const { error, value } = BatchValidationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            throw new ApiError(
                400,
                "Validation failed",
                error.details.map((d) => ({
                    field: d.path.join("."),
                    message: d.message
                }))
            );
        }

        const {branches,name,createdBy,startDate,endDate,mentors=[],studentCapacity,students=[],teacherCapacity,isActive,subjects =[],routine = []} = value;

        const year = new Date(startDate).getFullYear();

      const normalizedName = name
        .trim()
        .toUpperCase()
        .replace(/\s+/g, "_")
        .replace(/[^A-Z0-9_]/g, "");

      const code = `KRJ-${year}-${normalizedName}`;

      const { error: batchCodeError } = batchCode.validate(code);
if (batchCodeError) {
  throw new ApiError(400, "Generated batch code is invalid");
}

const start = new Date(startDate);

const end = endDate
  ? new Date(endDate)
  : new Date(new Date(start).setFullYear(start.getFullYear() + 1));

     
        const admin = await Admin.findById(createdBy).session(session);
        
        if (!admin) {
          throw new ApiError(403, "Invalid admin");
        }

        if (
          !admin.permissions ||
          !admin.permissions.includes("manage_batches")
        ) {
          throw new ApiError(
            403,
            "Admin does not have permission to manage batches"
          );
        }



        const currentStudentCount = 0;
const currentTeacherCount = 0;

       if(students && students.length && (currentStudentCount+students.length)>studentCapacity){
        throw new ApiError(
            403,
            "This batch is full , no more students can be added"
          );
       }

       if(mentors && mentors.length && (currentTeacherCount+mentors.length)>teacherCapacity){
        throw new ApiError(
            403,
            "This batch is full , no more teachers can be added"
          );
       }







       const existingBatches = await Batch.find({
  name: new RegExp(`^${name}$`, "i"),
  branches: { $in: branches },
}).select("branches");

const existingBranchIds = new Set(
  existingBatches.flatMap(b => b.branches.map(id => id.toString()))
);

const incomingBranchIds = branches.map(id => id.toString());

const alreadyPresentBranches = incomingBranchIds.filter(id =>
  existingBranchIds.has(id)
);

const newBranchesToAdd = incomingBranchIds.filter(id =>
  !existingBranchIds.has(id)
);


if (alreadyPresentBranches.length && !newBranchesToAdd.length) {
  await session.commitTransaction();

  return successResponse(res, {
    statusCode: 200,
    message: "Batch already exists in all selected branches",
    data: {
      name,
      code,
      counts: {
        addedBranches: 0,
        skippedBranches: alreadyPresentBranches.length,
      },
      admin: {
        name: admin.fullName,
        email: admin.email,
      },
      startDate,
      endDate: endDate || end,
      isActive,
    },
  });
}





 const [batch] = await Batch.create(
      [
        {
  branches:newBranchesToAdd,
  name,
  code,
  createdBy,
  managedBy:[createdBy],
  startDate,
  endDate:endDate ||end,
  mentors,
  studentCapacity,
  students,
  currentStudentCount:currentStudentCount+students.length,
  currentTeacherCount:currentTeacherCount+mentors.length,
  teacherCapacity,
  isActive,
  subjects,
  routine
}
,
      ],
      { session }
    );


        if (students.length) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { batches: batch._id } },
        { session }
      );
    }

    if (mentors.length) {
      await Teacher.updateMany(
        { _id: { $in: mentors } },
        { $addToSet: { batches: batch._id } },
        { session }
      );
    }

    if (routine.length) {
      await RoutineSlot.updateMany(
        { _id: { $in: routine } },
        { $addToSet: { batches: batch._id } },
        { session }
      );
    }
    if (subjects.length) {
      await Subject.updateMany(
        { _id: { $in: subjects } },
        { $addToSet: { batches: batch._id } },
        { session }
      );
    }

    await Admin.updateOne(
  { _id: createdBy },
  {
    $addToSet: {
      createdBatches: batch._id,
      managedBatches: batch._id,
    },
  },
  { session }
);






    let message = "Batch processed successfully";

if (alreadyPresentBranches.length && newBranchesToAdd.length) {
  message =
    "Batch already existed in some branches and was added to remaining branches";
} else if (alreadyPresentBranches.length && !newBranchesToAdd.length) {
  message = "Batch already exists in all selected branches";
} else if (!alreadyPresentBranches.length && newBranchesToAdd.length) {
  message = "Batch added to branches successfully";
}

const creator = admin;


const data = {
  name: batch.name,
  code: batch.code,

  counts: {
    addedBranches: newBranchesToAdd.length,
    skippedBranches: alreadyPresentBranches.length,
    totalStudentsAdded: students.length,
    totalMentorsAdded: mentors.length,
    currentStudentCount: currentStudentCount + students.length,
    currentTeacherCount: currentTeacherCount + mentors.length,
    studentCapacity,
    teacherCapacity,
  },

  admin: {
    name: creator.fullName,
    email: creator.email,
  },

  startDate,
  endDate: endDate || end,
  isActive,
};


   await session.commitTransaction();



return successResponse(res, {
  statusCode: 200,
  message,
  data
});


            
          } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addStudentToBatch = asyncHandler(async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = addStudentValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map(d => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }



    const { students, batchId, adminId } = value;

const admin = await Admin.findById(adminId).session(session);
if (!admin) {
  throw new ApiError(403, "Invalid admin");
}

if (
  !admin.permissions ||
  !admin.permissions.includes("manage_batches")
) {
  throw new ApiError(
    403,
    "Admin does not have permission to manage batches"
  );
}


const isBatchManager = batch.managedBy
  .map(id => id.toString())
  .includes(adminId.toString());

if (!isBatchManager) {
  throw new ApiError(
    403,
    "Admin is not authorized to manage this batch"
  );
}


    const batch = await Batch.findById(batchId).session(session);
    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const existingStudentIds = new Set(
      batch.students.map(id => id.toString())
    );

    const incomingStudentIds = students.map(id => id.toString());

    const alreadyPresentStudents = incomingStudentIds.filter(id =>
      existingStudentIds.has(id)
    );

    const newStudentsToAdd = incomingStudentIds.filter(id =>
      !existingStudentIds.has(id)
    );

    if (
      batch.currentStudentCount + newStudentsToAdd.length >
      batch.studentCapacity
    ) {
      throw new ApiError(
        403,
        "Student capacity exceeded for this batch"
      );
    }

    if (newStudentsToAdd.length) {
      await Batch.updateOne(
        { _id: batchId },
        {
          $addToSet: { students: { $each: newStudentsToAdd } },
          $inc: { currentStudentCount: newStudentsToAdd.length },
        },
        { session }
      );

      await Student.updateMany(
        { _id: { $in: newStudentsToAdd } },
        { $addToSet: { batches: batchId } },
        { session }
      );
    }

    let message = "Students processed successfully";

    if (alreadyPresentStudents.length && newStudentsToAdd.length) {
      message =
        "Some students were already in the batch, remaining students were added";
    } else if (alreadyPresentStudents.length && !newStudentsToAdd.length) {
      message = "All students already exist in this batch";
    } else if (!alreadyPresentStudents.length && newStudentsToAdd.length) {
      message = "Students added to batch successfully";
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 200,
      message,
      data: {
        batchId,
        counts: {
          addedStudents: newStudentsToAdd.length,
          skippedStudents: alreadyPresentStudents.length,
          currentStudentCount:
            batch.currentStudentCount + newStudentsToAdd.length,
          studentCapacity: batch.studentCapacity,
        },
        admin: {
          name: admin.fullName,
          email: admin.email,
        },
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addTeacherToBatch = asyncHandler(async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = addTeacherValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map(d => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const { mentors, batchId, adminId } = value;

    const admin = await Admin.findById(adminId).session(session);
    if (!admin) {
      throw new ApiError(403, "Invalid admin");
    }

    if (
      !admin.permissions ||
      !admin.permissions.includes("manage_batches")
    ) {
      throw new ApiError(
        403,
        "Admin does not have permission to manage batches"
      );
    }

    const batch = await Batch.findById(batchId).session(session);
    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const isBatchManager = batch.managedBy
      .map(id => id.toString())
      .includes(adminId.toString());

    if (!isBatchManager) {
      throw new ApiError(
        403,
        "Admin is not authorized to manage this batch"
      );
    }

    const existingMentorIds = new Set(
      batch.mentors.map(id => id.toString())
    );

    const incomingMentorIds = mentors.map(id => id.toString());

    const alreadyPresentMentors = incomingMentorIds.filter(id =>
      existingMentorIds.has(id)
    );

    const newMentorsToAdd = incomingMentorIds.filter(id =>
      !existingMentorIds.has(id)
    );

    if (
      batch.currentTeacherCount + newMentorsToAdd.length >
      batch.teacherCapacity
    ) {
      throw new ApiError(
        403,
        "Teacher capacity exceeded for this batch"
      );
    }

    if (newMentorsToAdd.length) {
      await Batch.updateOne(
        { _id: batchId },
        {
          $addToSet: { mentors: { $each: newMentorsToAdd } },
          $inc: { currentTeacherCount: newMentorsToAdd.length },
        },
        { session }
      );

      await Teacher.updateMany(
        { _id: { $in: newMentorsToAdd } },
        { $addToSet: { batches: batchId } },
        { session }
      );
    }

    let message = "Teachers processed successfully";

    if (alreadyPresentMentors.length && newMentorsToAdd.length) {
      message =
        "Some teachers were already in the batch, remaining teachers were added";
    } else if (alreadyPresentMentors.length && !newMentorsToAdd.length) {
      message = "All teachers already exist in this batch";
    } else if (!alreadyPresentMentors.length && newMentorsToAdd.length) {
      message = "Teachers added to batch successfully";
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 200,
      message,
      data: {
        batchId,
        counts: {
          addedTeachers: newMentorsToAdd.length,
          skippedTeachers: alreadyPresentMentors.length,
          currentTeacherCount:
            batch.currentTeacherCount + newMentorsToAdd.length,
          teacherCapacity: batch.teacherCapacity,
        },
        admin: {
          name: admin.fullName,
          email: admin.email,
        },
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addRoutineToBatch = asyncHandler(async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = addRoutineValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map(d => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const { routine, batchId, adminId } = value;

    const admin = await Admin.findById(adminId).session(session);
    if (!admin) {
      throw new ApiError(403, "Invalid admin");
    }

    if (
      !admin.permissions ||
      !admin.permissions.includes("manage_batches")
    ) {
      throw new ApiError(
        403,
        "Admin does not have permission to manage batches"
      );
    }

    const batch = await Batch.findById(batchId).session(session);
    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const isBatchManager = batch.managedBy
      .map(id => id.toString())
      .includes(adminId.toString());

    if (!isBatchManager) {
      throw new ApiError(
        403,
        "Admin is not authorized to manage this batch"
      );
    }

    const existingRoutineIds = new Set(
      batch.routine.map(id => id.toString())
    );

    const incomingRoutineIds = routine.map(id => id.toString());

    const alreadyPresentRoutines = incomingRoutineIds.filter(id =>
      existingRoutineIds.has(id)
    );

    const newRoutinesToAdd = incomingRoutineIds.filter(id =>
      !existingRoutineIds.has(id)
    );

    if (newRoutinesToAdd.length) {
      await Batch.updateOne(
        { _id: batchId },
        {
          $addToSet: { routine: { $each: newRoutinesToAdd } },
        },
        { session }
      );

      await RoutineSlot.updateMany(
        { _id: { $in: newRoutinesToAdd } },
        { $addToSet: { batches: batchId } },
        { session }
      );
    }

    let message = "Routines processed successfully";

    if (alreadyPresentRoutines.length && newRoutinesToAdd.length) {
      message =
        "Some routines were already in the batch, remaining routines were added";
    } else if (alreadyPresentRoutines.length && !newRoutinesToAdd.length) {
      message = "All routines already exist in this batch";
    } else if (!alreadyPresentRoutines.length && newRoutinesToAdd.length) {
      message = "Routines added to batch successfully";
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 200,
      message,
      data: {
        batchId,
        counts: {
          addedRoutines: newRoutinesToAdd.length,
          skippedRoutines: alreadyPresentRoutines.length,
        },
        admin: {
          name: admin.fullName,
          email: admin.email,
        },
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addSubjectToBatch = asyncHandler(async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = addSubjectValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map(d => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const { subjects, batchId, adminId } = value;

    const admin = await Admin.findById(adminId).session(session);
    if (!admin) {
      throw new ApiError(403, "Invalid admin");
    }

    if (
      !admin.permissions ||
      !admin.permissions.includes("manage_batches")
    ) {
      throw new ApiError(
        403,
        "Admin does not have permission to manage batches"
      );
    }

    const batch = await Batch.findById(batchId).session(session);
    if (!batch) {
      throw new ApiError(404, "Batch not found");
    }

    const isBatchManager = batch.managedBy
      .map(id => id.toString())
      .includes(adminId.toString());

    if (!isBatchManager) {
      throw new ApiError(
        403,
        "Admin is not authorized to manage this batch"
      );
    }

    const existingSubjectIds = new Set(
      batch.subjects.map(id => id.toString())
    );

    const incomingSubjectIds = subjects.map(id => id.toString());

    const alreadyPresentSubjects = incomingSubjectIds.filter(id =>
      existingSubjectIds.has(id)
    );

    const newSubjectsToAdd = incomingSubjectIds.filter(id =>
      !existingSubjectIds.has(id)
    );

    if (newSubjectsToAdd.length) {
      await Batch.updateOne(
        { _id: batchId },
        {
          $addToSet: { subjects: { $each: newSubjectsToAdd } },
        },
        { session }
      );

      await BatchSubject.updateMany(
        { subject: { $in: newSubjectsToAdd }, batch: batchId },
        {},
        { session }
      );
    }

    let message = "Subjects processed successfully";

    if (alreadyPresentSubjects.length && newSubjectsToAdd.length) {
      message =
        "Some subjects were already in the batch, remaining subjects were added";
    } else if (alreadyPresentSubjects.length && !newSubjectsToAdd.length) {
      message = "All subjects already exist in this batch";
    } else if (!alreadyPresentSubjects.length && newSubjectsToAdd.length) {
      message = "Subjects added to batch successfully";
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 200,
      message,
      data: {
        batchId,
        counts: {
          addedSubjects: newSubjectsToAdd.length,
          skippedSubjects: alreadyPresentSubjects.length,
        },
        admin: {
          name: admin.fullName,
          email: admin.email,
        },
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});



export {createBatch,addStudentToBatch,addRoutineToBatch,addSubjectToBatch,addTeacherToBatch}