import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import { Student } from "../../Schema/Student/Student.Schema.js";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import { objectId } from "../../Validations/Routine/Routine.Validations.js";


 const getRoutines = asyncHandler(async (req, res) => {
  const {
    role,
    entityId,
    day,
    date,
    fromTime,
    toTime,
    subjectId
  } = req.query;

  const query = {};

  // 🔹 Role-based mapping
  if (role === "teacher") {
    query.teachers = entityId;
  }

  if (role === "student") {
    // you resolve student → batchIds beforehand
    query.batches = { $in: req.studentBatchIds };
  }

  // 🔹 Day / Date
  if (date) {
    query.specificDate = date;
  } else if (day) {
    query.day = day;
  }

  // 🔹 Subject filter
  if (subjectId) {
    query.subject = subjectId;
  }

  // 🔹 Time window
  if (fromTime && toTime) {
    query.startTime = { $lte: toTime };
    query.endTime = { $gte: fromTime };
  }

  const routines = await RoutineSlot.find(query)
    .populate("subject", "name code")
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ startTime: 1 })
    .lean();

  return successResponse(res, 200, "Routines fetched", routines);
});
 const getSingleRoutine = asyncHandler(async (req, res) => {
  const { routineId } = req.params;

  const { error } = objectId.required().validate(routineId);
  if (error) {
    throw new ApiError(400, "Invalid routine ID");
  }

  const routine = await RoutineSlot.findById(routineId)
    // 🔹 Subject
    .populate({
      path: "subject",
      select: "name code type initials description"
    })

    // 🔹 Batches
    .populate({
      path: "batches",
      select: "name code year isActive"
    })

    // 🔹 Teachers → User
    .populate({
      path: "teachers",
      select: "userId experience subjects",
      populate: {
        path: "userId",
        select: "firstName lastName email phone"
      }
    });

  if (!routine) {
    throw new ApiError(404, "Routine not found");
  }

  return successResponse(
    res,
    200,
    "Routine fetched successfully",
    routine
  );
});

 const getAllRoutinesOfBranchByBatch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  
  const { error } = objectId.required().validate(branchId);
  if (error) {
    throw new ApiError(400, "Invalid branch ID");
  }

  const branch = await Branch.findById(branchId)
    .select("name code batches")
    .populate({
      path: "batches",
      select: "name code"
    })
    .lean();

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  const batchIds = branch.batches.map(b => b._id);

  if (batchIds.length === 0) {
    return successResponse(res, 200, "No batches found for branch", {
      branch,
      batches: []
    });
  }

  const routines = await RoutineSlot.find({
    batches: { $in: batchIds }
  })
    .populate({
      path: "subject",
      select: "name code"
    })
    .populate({
      path: "batches",
      select: "name code"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ day: 1, startTime: 1 })
    .lean();

  const batchMap = {};

  for (const batch of branch.batches) {
    batchMap[batch._id] = {
      _id: batch._id,
      name: batch.name,
      code: batch.code,
      routines: []
    };
  }

  for (const routine of routines) {
    for (const batch of routine.batches) {
      if (!batchMap[batch._id]) continue;

      batchMap[batch._id].routines.push({
        routineId: routine._id,
        day: routine.day,
        startTime: routine.startTime,
        endTime: routine.endTime,
        subject: routine.subject,
        teachers: routine.teachers.map(t => ({
          _id: t._id,
          ...t.userId
        }))
      });
    }
  }

  return successResponse(
    res,
    200,
    "Branch routines fetched successfully",
    {
      branch: {
        _id: branch._id,
        name: branch.name,
        code: branch.code
      },
      batches: Object.values(batchMap)
    }
  );
});


 const getTodayRoutineForEachBranchByBatch = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  const { error } = objectId.required().validate(branchId);
  if (error) {
    throw new ApiError(400, "Invalid branch ID");
  }

  const branch = await Branch.findById(branchId)
    .select("batches name code")
    .lean();

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  if (!branch.batches || branch.batches.length === 0) {
    return successResponse(
      res,
      200,
      "No batches found for this branch",
      []
    );
  }

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = days[new Date().getDay()];

  const routines = await RoutineSlot.find({
    batches: { $in: branch.batches },
    day: today
  })
    .populate({
      path: "subject",
      select: "name code"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .populate({
      path: "batches",
      select: "name code"
    })
    .sort({ startTime: 1 })
    .lean();

  const batchMap = {};

  for (const routine of routines) {
    for (const batch of routine.batches) {
      // Only include batches that belong to this branch
      if (!branch.batches.some(b => b.toString() === batch._id.toString())) {
        continue;
      }

      if (!batchMap[batch._id]) {
        batchMap[batch._id] = {
          _id: batch._id,
          name: batch.name,
          code: batch.code,
          routines: []
        };
      }

      batchMap[batch._id].routines.push({
        routineId: routine._id,
        startTime: routine.startTime,
        endTime: routine.endTime,
        subject: routine.subject,
        teachers: routine.teachers.map(t => ({
          _id: t._id,
          ...t.userId
        }))
      });
    }
  }

  return successResponse(
    res,
    200,
    "Today's routines fetched successfully",
    Object.values(batchMap)
  );
});

 const getTodayRoutineByBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  
  const { error } = objectId.required().validate(batchId);
  if (error) {
    throw new ApiError(400, "Invalid batch ID");
  }

  const batch = await Batch.findById(batchId).select("_id").lean();
if (!batch) {
  throw new ApiError(404, "Batch not found");
}

 
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const today = days[new Date().getDay()];


  const routines = await RoutineSlot.find({
    batches: batchId,
    day: today
  })
    .populate({
      path: "subject",
      select: "name code"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ startTime: 1 })
    .lean();

  
  const formattedRoutines = routines.map(routine => ({
    routineId: routine._id,
    startTime: routine.startTime,
    endTime: routine.endTime,
    subject: routine.subject,
    teachers: routine.teachers.map(t => ({
      _id: t._id,
      ...t.userId
    }))
  }));

  return successResponse(
    res,
    200,
    "Today's routine fetched successfully",
    {
      batchId,
      day: today,
      routines: formattedRoutines
    }
  );
});

 const getAllRoutinesOfBatch = asyncHandler(async (req, res) => {
  const { batchId } = req.params;
  const { day, subjectId, date } = req.query;

  const { error } = objectId.required().validate(batchId);
  if (error) {
    throw new ApiError(400, "Invalid batch ID");
  }

  const batchExists = await Batch.exists({ _id: batchId });
  if (!batchExists) {
    throw new ApiError(404, "Batch not found");
  }

  if (day && date) {
    throw new ApiError(
      400,
      "Provide either day or specificDate, not both"
    );
  }

  const query = { batches: batchId };

  if (day) query.day = day;
  if (date) query.specificDate = date;

  if (subjectId) {
    const { error: subjectErr } =
      objectId.required().validate(subjectId);
    if (subjectErr) {
      throw new ApiError(400, "Invalid subject ID");
    }

    const subjectExists = await Subject.exists({
      _id: subjectId,
      batches: batchId
    });

    if (!subjectExists) {
      throw new ApiError(
        400,
        "Subject does not belong to this batch"
      );
    }

    query.subject = subjectId;
  }

  const routines = await RoutineSlot.find(query)
    .populate({
      path: "subject",
      select: "name code type"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName email"
      }
    })
    .sort({ day: 1, startTime: 1 })
    .lean();

  return successResponse(
    res,
    200,
    "Batch routines fetched successfully",
    {
      batchId,
      total: routines.length,
      routines
    }
  );
});


 const getAllRoutinesOfStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  const { error } = objectId.required().validate(studentId);
  if (error) {
    throw new ApiError(400, "Invalid student ID");
  }

  const student = await Student.findById(studentId)
    .select("batches subjects")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  const { batches = [], subjects = [] } = student;

  if (!batches.length) {
    return successResponse(
      res,
      200,
      "Student has no assigned batches",
      {
        studentId,
        weeklyTimetable: {},
        todayRoutine: []
      }
    );
  }

  const routineQuery = {
    batches: { $in: batches }
  };

  if (subjects.length) {
    routineQuery.subject = { $in: subjects };
  }

  const routines = await RoutineSlot.find(routineQuery)
    .populate({
      path: "subject",
      select: "name code"
    })
    .populate({
      path: "batches",
      select: "name code"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ day: 1, startTime: 1 })
    .lean();

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weeklyTimetable = Object.fromEntries(
    days.map(d => [d, []])
  );

  for (const routine of routines) {
    weeklyTimetable[routine.day].push({
      routineId: routine._id,
      subject: routine.subject,
      batches: routine.batches,
      startTime: routine.startTime,
      endTime: routine.endTime,
      teachers: routine.teachers.map(t => ({
        _id: t._id,
        ...t.userId
      }))
    });
  }

  const today = days[new Date().getDay()];

  const todayRoutine = weeklyTimetable[today].map(r => ({
    subject: r.subject,
    batches: r.batches,
    time: `${r.startTime} - ${r.endTime}`,
    teachers: r.teachers
  }));

  return successResponse(
    res,
    200,
    "Student routines fetched successfully",
    {
      studentId,
      weeklyTimetable,
      todayRoutine
    }
  );
});


 const getAllRoutinesOfTeacher = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const { error } = objectId.required().validate(teacherId);
  if (error) {
    throw new ApiError(400, "Invalid teacher ID");
  }

  const teacherExists = await Teacher.exists({ _id: teacherId });
  if (!teacherExists) {
    throw new ApiError(404, "Teacher not found");
  }

  const routines = await RoutineSlot.find({
    teachers: teacherId
  })
    .populate({
      path: "subject",
      select: "name code"
    })
    .populate({
      path: "batches",
      select: "name code branch"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ day: 1, startTime: 1 })
    .lean();

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weeklyTimetable = Object.fromEntries(
    days.map(d => [d, []])
  );

  for (const routine of routines) {
    weeklyTimetable[routine.day].push({
      routineId: routine._id,
      subject: routine.subject,
      batches: routine.batches.map(b => ({
        _id: b._id,
        name: b.name,
        code: b.code,
        branch: b.branch // derived, not stored in routine
      })),
      startTime: routine.startTime,
      endTime: routine.endTime,
      teachers: routine.teachers.map(t => ({
        _id: t._id,
        ...t.userId
      }))
    });
  }

  const today = days[new Date().getDay()];

  const todayRoutine = weeklyTimetable[today].map(r => ({
    subject: r.subject,
    batches: r.batches,
    time: `${r.startTime} - ${r.endTime}`,
    teachers: r.teachers
  }));

  return successResponse(
    res,
    200,
    "Teacher routines fetched successfully",
    {
      teacherId,
      weeklyTimetable,
      todayRoutine
    }
  );
});


 const getAllRoutinesOfSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const { error } = objectId.required().validate(subjectId);
  if (error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const subject = await Subject.findById(subjectId)
    .select("_id name code")
    .lean();

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  const routines = await RoutineSlot.find({
    subject: subjectId
  })
    .populate({
      path: "batches",
      select: "name code branch"
    })
    .populate({
      path: "teachers",
      select: "userId",
      populate: {
        path: "userId",
        select: "firstName lastName"
      }
    })
    .sort({ day: 1, startTime: 1 })
    .lean();

  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weeklyTimetable = Object.fromEntries(
    days.map(d => [d, []])
  );

  for (const routine of routines) {
    weeklyTimetable[routine.day].push({
      routineId: routine._id,
      batches: routine.batches.map(b => ({
        _id: b._id,
        name: b.name,
        code: b.code,
        branch: b.branch // derived, not stored in routine
      })),
      startTime: routine.startTime,
      endTime: routine.endTime,
      teachers: routine.teachers.map(t => ({
        _id: t._id,
        ...t.userId
      }))
    });
  }

  const today = days[new Date().getDay()];

  const todayRoutine = weeklyTimetable[today].map(r => ({
    batches: r.batches,
    time: `${r.startTime} - ${r.endTime}`,
    teachers: r.teachers
  }));

  return successResponse(
    res,
    200,
    "Subject routines fetched successfully",
    {
      subject,
      weeklyTimetable,
      todayRoutine
    }
  );
});



export {getAllRoutinesOfBatch,getAllRoutinesOfBranchByBatch,getAllRoutinesOfStudent,getAllRoutinesOfSubject,getAllRoutinesOfTeacher,getRoutines,getSingleRoutine,getTodayRoutineByBatch,getTodayRoutineForEachBranchByBatch}


