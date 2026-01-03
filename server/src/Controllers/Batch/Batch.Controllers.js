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




const BatchValidationSchema = Joi.object({
  branches: branches.required(),
  name: name.required(),
  createdBy:createdBy.required(),
  

  startDate: startDate.required(),
  endDate: endDate.optional(),

  mentors: mentors.optional(),
  students:students.optional(),
  studentCapacity: studentCapacity.required(),
  currentStudentCount: currentStudentCount.optional(),

  teacherCapacity: teacherCapacity.required(),
  currentTeacherCount: currentTeacherCount.optional(),

  isActive: isActive.optional(),

  subjects: subjects.optional(),
  routine: routine.optional(),
 
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

     
        const admin = await Admin.findById(createdBy);
        
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

const addStudentToBatch = asyncHandler(async(req,res)=>{

})
const addTeacherToBatch =asyncHandler(async(req,res)=>{

})
const addRoutineToBatch = asyncHandler(async(req,res)=>{

})


export {createBatch}