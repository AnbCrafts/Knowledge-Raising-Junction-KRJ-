import Joi from "joi";
import { areaCode, booleanField, branchCode, dateField, name, objectId } from "../../Validations/Branch/Branch.Validations.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";



const branchQueryValidationSchema = Joi.object({
  isActive: booleanField.optional(),
  areaCode: areaCode.optional(),
  branchCode: branchCode.optional(),
  name: name.trim().optional(),
  managedBy: objectId.optional(),
  studentId: objectId.optional(),
  employeeId: objectId.optional(),
  batchId: objectId.optional(),
  from: dateField.optional(),
  to: dateField.optional(),
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).max(100).optional(),
  sortBy: Joi.string().valid("createdAt", "name").optional(),
  order: Joi.string().valid("asc", "desc").optional(),
});

const getBranches = asyncHandler(async (req, res) => {
  const { error, value } = branchQueryValidationSchema.validate(req.query, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Invalid query parameters",
      error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const {
    isActive,
    areaCode,
    branchCode,
    name,
    managedBy,
    studentId,
    employeeId,
    batchId,
    from,
    to,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = "desc",
  } = value;

  const query = {};

  if (isActive !== undefined) query.isActive = isActive;
  if (areaCode) query.branchCode = new RegExp(`-${areaCode}-`);
  if (branchCode) query.branchCode = branchCode;
  if (name) query.name = new RegExp(name, "i");
  if (managedBy) query.managedBy = managedBy;
  if (studentId) query.students = studentId;
  if (employeeId) query.employees = employeeId;
  if (batchId) query.batches = batchId;

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  const [branches, total] = await Promise.all([
    Branch.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Branch.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Branches fetched successfully",
    data: {
      total,
      page,
      limit,
      branches,
    },
  });
});

 const getBranchById = asyncHandler(async (req, res) => {
  const { branchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(branchId)) {
    throw new ApiError(400, "Invalid branch ID");
  }

  const branch = await Branch.findById(branchId)
    .populate("managedBy", "firstName lastName email")
    .populate("createdBy", "firstName lastName email");

  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  return successResponse(
    res,
    200,
    "Branch fetched successfully",
    branch
  );
});


// ROUTINE-CENTRIC

const getSoftDeletedRoutines = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({ isActive: false })
    .select("day startTime endTime deletedAt deletedBy deleteReason subject batches teachers")
    .populate("deletedBy", "name email")
    .sort({ deletedAt: -1 });

  return successResponse(res, {
    message: "Soft deleted routines fetched successfully",
    data: routines
  });
});


const getOrphanRoutines = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({
    isActive: true,
    subject: null,
    batches: { $size: 0 },
    teachers: { $size: 0 }
  })
    .select("day startTime endTime createdAt updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Orphan routines fetched successfully",
    data: routines
  });
});


const getIncompleteRoutines = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({
    isActive: true,
    $or: [
      { subject: null },
      { batches: { $size: 0 } },
      { teachers: { $size: 0 } },
      { day: { $exists: false } },
      { startTime: { $exists: false } },
      { endTime: { $exists: false } }
    ]
  })
    .select("day startTime endTime subject batches teachers updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Incomplete routines fetched successfully",
    data: routines
  });
});


const getRoutinesWithoutBatches = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({
    isActive: true,
    batches: { $size: 0 }
  })
    .select("day startTime endTime subject teachers updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Routines without batches fetched successfully",
    data: routines
  });
});

const getRoutinesWithoutTeachers = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({
    isActive: true,
    teachers: { $size: 0 }
  })
    .select("day startTime endTime subject batches updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Routines without teachers fetched successfully",
    data: routines
  });
});

const getRoutinesWithoutSubject = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({
    isActive: true,
    subject: null
  })
    .select("day startTime endTime batches teachers updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Routines without subject fetched successfully",
    data: routines
  });
});

const getRoutineConflicts = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({ isActive: true })
    .select("_id day startTime endTime batches teachers subject")
    .lean();

  const batchConflicts = [];
  const teacherConflicts = [];

  for (let i = 0; i < routines.length; i++) {
    for (let j = i + 1; j < routines.length; j++) {
      const r1 = routines[i];
      const r2 = routines[j];

      if (r1.day !== r2.day) continue;

      const timeOverlap =
        r1.startTime < r2.endTime && r1.endTime > r2.startTime;

      if (!timeOverlap) continue;

      const commonBatches = r1.batches.filter(b =>
        r2.batches.includes(b)
      );

      if (commonBatches.length) {
        batchConflicts.push({
          type: "BATCH_CONFLICT",
          batches: commonBatches,
          routines: [r1._id, r2._id],
          day: r1.day,
          time: {
            r1: { start: r1.startTime, end: r1.endTime },
            r2: { start: r2.startTime, end: r2.endTime }
          }
        });
      }

      const commonTeachers = r1.teachers.filter(t =>
        r2.teachers.includes(t)
      );

      if (commonTeachers.length) {
        teacherConflicts.push({
          type: "TEACHER_CONFLICT",
          teachers: commonTeachers,
          routines: [r1._id, r2._id],
          day: r1.day,
          time: {
            r1: { start: r1.startTime, end: r1.endTime },
            r2: { start: r2.startTime, end: r2.endTime }
          }
        });
      }
    }
  }

  return successResponse(res, {
    message: "Routine conflicts fetched successfully",
    data: {
      batchConflicts,
      teacherConflicts,
      totalConflicts: batchConflicts.length + teacherConflicts.length
    }
  });
});



// SUBJECT-CENTRIC

const getSubjectsWithoutRoutines = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    isActive: true,
    $or: [
      { routines: { $exists: false } },
      { routines: { $size: 0 } }
    ]
  })
    .select("name code type batches teachers updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Subjects without routines fetched successfully",
    data: subjects
  });
});

const getSubjectsWithoutTeachers = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    isActive: true,
    $or: [
      { teachers: { $exists: false } },
      { teachers: { $size: 0 } }
    ]
  })
    .select("name code type batches routines updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Subjects without teachers fetched successfully",
    data: subjects
  });
});


const getSubjectsAssignedButNotScheduled = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    isActive: true,
    batches: { $exists: true, $ne: [] }
  })
    .select("_id name code batches")
    .lean();

  const subjectIds = subjects.map(s => s._id);

  const scheduledSubjects = await RoutineSlot.distinct("subject", {
    isActive: true,
    subject: { $in: subjectIds }
  });

  const scheduledSet = new Set(scheduledSubjects.map(id => id.toString()));

  const unscheduledSubjects = subjects.filter(
    s => !scheduledSet.has(s._id.toString())
  );

  return successResponse(res, {
    message: "Subjects assigned to batches but not scheduled fetched successfully",
    data: unscheduledSubjects
  });
});



// TEACHER-CENTRIC
const getTeachersWithoutRoutines = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({
    isActive: true,
    $or: [
      { routines: { $exists: false } },
      { routines: { $size: 0 } }
    ]
  })
    .select("name email subjects updatedAt")
    .sort({ updatedAt: -1 });

  return successResponse(res, {
    message: "Teachers without routines fetched successfully",
    data: teachers
  });
});

const getTeachersAssignedButNotScheduled = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find({
    isActive: true,
    subjects: { $exists: true, $ne: [] }
  })
    .select("_id name email subjects")
    .lean();

  const teacherIds = teachers.map(t => t._id);

  const scheduledTeachers = await RoutineSlot.distinct("teachers", {
    isActive: true,
    teachers: { $in: teacherIds }
  });

  const scheduledSet = new Set(scheduledTeachers.map(id => id.toString()));

  const unscheduledTeachers = teachers.filter(
    t => !scheduledSet.has(t._id.toString())
  );

  return successResponse(res, {
    message: "Teachers assigned to subjects but not scheduled fetched successfully",
    data: unscheduledTeachers
  });
});

const getTeacherConflicts = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({ isActive: true })
    .select("_id day startTime endTime teachers subject batches")
    .lean();

  const conflicts = [];

  for (let i = 0; i < routines.length; i++) {
    for (let j = i + 1; j < routines.length; j++) {
      const r1 = routines[i];
      const r2 = routines[j];

      if (r1.day !== r2.day) continue;

      const timeOverlap =
        r1.startTime < r2.endTime &&
        r1.endTime > r2.startTime;

      if (!timeOverlap) continue;

      const commonTeachers = r1.teachers.filter(t =>
        r2.teachers.includes(t)
      );

      if (commonTeachers.length) {
        conflicts.push({
          type: "TEACHER_CONFLICT",
          teachers: commonTeachers,
          routines: [
            {
              routineId: r1._id,
              subject: r1.subject,
              batches: r1.batches,
              time: { start: r1.startTime, end: r1.endTime }
            },
            {
              routineId: r2._id,
              subject: r2.subject,
              batches: r2.batches,
              time: { start: r2.startTime, end: r2.endTime }
            }
          ],
          day: r1.day
        });
      }
    }
  }

  return successResponse(res, {
    message: "Teacher conflicts fetched successfully",
    data: {
      conflicts,
      totalConflicts: conflicts.length
    }
  });
});


const getBatchesWithoutRoutines = asyncHandler(async (req, res) => {
  const batches = await Batch.find({
    isActive: true
  })
    .select("_id name code")
    .lean();

  const batchIds = batches.map(b => b._id);

  const scheduledBatches = await RoutineSlot.distinct("batches", {
    isActive: true,
    batches: { $in: batchIds }
  });

  const scheduledSet = new Set(scheduledBatches.map(id => id.toString()));

  const unscheduledBatches = batches.filter(
    b => !scheduledSet.has(b._id.toString())
  );

  return successResponse(res, {
    message: "Batches without routines fetched successfully",
    data: unscheduledBatches
  });
});

const getBatchesWithSubjectNotScheduled = asyncHandler(async (req, res) => {
  const batches = await Batch.find({
    isActive: true,
    subjects: { $exists: true, $ne: [] }
  })
    .select("_id name code subjects")
    .lean();

  const batchIds = batches.map(b => b._id);

  const scheduledPairs = await RoutineSlot.find({
    isActive: true,
    batches: { $in: batchIds },
    subject: { $ne: null }
  })
    .select("subject batches")
    .lean();

  const scheduledSet = new Set();
  for (const r of scheduledPairs) {
    for (const b of r.batches) {
      scheduledSet.add(`${b.toString()}::${r.subject.toString()}`);
    }
  }

  const result = [];

  for (const batch of batches) {
    for (const subjectId of batch.subjects) {
      const key = `${batch._id.toString()}::${subjectId.toString()}`;
      if (!scheduledSet.has(key)) {
        result.push({
          batch: {
            _id: batch._id,
            name: batch.name,
            code: batch.code
          },
          subject: subjectId
        });
      }
    }
  }

  return successResponse(res, {
    message: "Batches with assigned subjects but not scheduled fetched successfully",
    data: result
  });
});

const getBatchConflicts = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({ isActive: true })
    .select("_id day startTime endTime batches subject teachers")
    .lean();

  const conflicts = [];

  for (let i = 0; i < routines.length; i++) {
    for (let j = i + 1; j < routines.length; j++) {
      const r1 = routines[i];
      const r2 = routines[j];

      if (r1.day !== r2.day) continue;

      const timeOverlap =
        r1.startTime < r2.endTime &&
        r1.endTime > r2.startTime;

      if (!timeOverlap) continue;

      const commonBatches = r1.batches.filter(b =>
        r2.batches.includes(b)
      );

      if (commonBatches.length) {
        conflicts.push({
          type: "BATCH_CONFLICT",
          batches: commonBatches,
          routines: [
            {
              routineId: r1._id,
              subject: r1.subject,
              teachers: r1.teachers,
              time: { start: r1.startTime, end: r1.endTime }
            },
            {
              routineId: r2._id,
              subject: r2.subject,
              teachers: r2.teachers,
              time: { start: r2.startTime, end: r2.endTime }
            }
          ],
          day: r1.day
        });
      }
    }
  }

  return successResponse(res, {
    message: "Batch conflicts fetched successfully",
    data: {
      conflicts,
      totalConflicts: conflicts.length
    }
  });
});


// SYSTEM / AUDIT

const getDanglingRoutineReferences = asyncHandler(async (req, res) => {
  const routines = await RoutineSlot.find({})
    .select("_id")
    .lean();

  const routineIdSet = new Set(routines.map(r => r._id.toString()));

  const dangling = {
    subjects: [],
    batches: [],
    teachers: []
  };

  const subjects = await Subject.find({
    routines: { $exists: true, $ne: [] }
  })
    .select("_id name routines")
    .lean();

  for (const subject of subjects) {
    const invalidRoutines = subject.routines.filter(
      r => !routineIdSet.has(r.toString())
    );

    if (invalidRoutines.length) {
      dangling.subjects.push({
        subjectId: subject._id,
        subjectName: subject.name,
        invalidRoutineIds: invalidRoutines
      });
    }
  }

  const batches = await Batch.find({
    routines: { $exists: true, $ne: [] }
  })
    .select("_id name routines")
    .lean();

  for (const batch of batches) {
    const invalidRoutines = batch.routines.filter(
      r => !routineIdSet.has(r.toString())
    );

    if (invalidRoutines.length) {
      dangling.batches.push({
        batchId: batch._id,
        batchName: batch.name,
        invalidRoutineIds: invalidRoutines
      });
    }
  }

  const teachers = await Teacher.find({
    routines: { $exists: true, $ne: [] }
  })
    .select("_id name routines")
    .lean();

  for (const teacher of teachers) {
    const invalidRoutines = teacher.routines.filter(
      r => !routineIdSet.has(r.toString())
    );

    if (invalidRoutines.length) {
      dangling.teachers.push({
        teacherId: teacher._id,
        teacherName: teacher.name,
        invalidRoutineIds: invalidRoutines
      });
    }
  }

  return successResponse(res, {
    message: "Dangling routine references fetched successfully",
    data: {
      dangling,
      summary: {
        subjects: dangling.subjects.length,
        batches: dangling.batches.length,
        teachers: dangling.teachers.length
      }
    }
  });
});

const getEmptyCollectionsAudit = asyncHandler(async (req, res) => {
  const [
    subjectCount,
    teacherCount,
    batchCount,
    routineCount
  ] = await Promise.all([
    Subject.countDocuments({}),
    Teacher.countDocuments({}),
    Batch.countDocuments({}),
    RoutineSlot.countDocuments({})
  ]);

  const audit = {
    subjects: subjectCount,
    teachers: teacherCount,
    batches: batchCount,
    routines: routineCount
  };

  const emptyCollections = Object.entries(audit)
    .filter(([_, count]) => count === 0)
    .map(([name]) => name);

  return successResponse(res, {
    message: "Empty collections audit fetched successfully",
    data: {
      counts: audit,
      emptyCollections
    }
  });
});

const getRecentlyModifiedSchedulingEntities = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 7;

  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const [routines, subjects, teachers, batches] = await Promise.all([
    RoutineSlot.find({ updatedAt: { $gte: sinceDate } })
      .select("_id day startTime endTime subject batches teachers updatedAt updatedBy")
      .sort({ updatedAt: -1 }),

    Subject.find({ updatedAt: { $gte: sinceDate } })
      .select("_id name code updatedAt updatedBy")
      .sort({ updatedAt: -1 }),

    Teacher.find({ updatedAt: { $gte: sinceDate } })
      .select("_id name email updatedAt updatedBy")
      .sort({ updatedAt: -1 }),

    Batch.find({ updatedAt: { $gte: sinceDate } })
      .select("_id name code updatedAt updatedBy")
      .sort({ updatedAt: -1 })
  ]);

  return successResponse(res, {
    message: "Recently modified scheduling entities fetched successfully",
    data: {
      windowInDays: days,
      since: sinceDate,
      routines,
      subjects,
      teachers,
      batches
    }
  });
});



// ADVANCED / HEALTH
const getScheduleReadinessReport = asyncHandler(async (req, res) => {
  const [
    orphanRoutinesCount,
    incompleteRoutinesCount,
    batchConflictsCount,
    teacherConflictsCount,
    subjectsAssignedNotScheduledCount,
    batchesWithoutRoutinesCount,
    teachersWithoutRoutinesCount
  ] = await Promise.all([
    RoutineSlot.countDocuments({
      isActive: true,
      subject: null,
      batches: { $size: 0 },
      teachers: { $size: 0 }
    }),

    RoutineSlot.countDocuments({
      isActive: true,
      $or: [
        { subject: null },
        { batches: { $size: 0 } },
        { teachers: { $size: 0 } },
        { day: { $exists: false } },
        { startTime: { $exists: false } },
        { endTime: { $exists: false } }
      ]
    }),

    (async () => {
      const routines = await RoutineSlot.find({ isActive: true })
        .select("day startTime endTime batches")
        .lean();

      let count = 0;
      for (let i = 0; i < routines.length; i++) {
        for (let j = i + 1; j < routines.length; j++) {
          if (routines[i].day !== routines[j].day) continue;
          if (
            routines[i].startTime < routines[j].endTime &&
            routines[i].endTime > routines[j].startTime &&
            routines[i].batches.some(b => routines[j].batches.includes(b))
          ) {
            count++;
          }
        }
      }
      return count;
    })(),

    (async () => {
      const routines = await RoutineSlot.find({ isActive: true })
        .select("day startTime endTime teachers")
        .lean();

      let count = 0;
      for (let i = 0; i < routines.length; i++) {
        for (let j = i + 1; j < routines.length; j++) {
          if (routines[i].day !== routines[j].day) continue;
          if (
            routines[i].startTime < routines[j].endTime &&
            routines[i].endTime > routines[j].startTime &&
            routines[i].teachers.some(t => routines[j].teachers.includes(t))
          ) {
            count++;
          }
        }
      }
      return count;
    })(),

    (async () => {
      const subjects = await Subject.find({
        isActive: true,
        batches: { $exists: true, $ne: [] }
      })
        .select("_id")
        .lean();

      const subjectIds = subjects.map(s => s._id);

      const scheduledSubjects = await RoutineSlot.distinct("subject", {
        isActive: true,
        subject: { $in: subjectIds }
      });

      return subjects.length - scheduledSubjects.length;
    })(),

    (async () => {
      const batches = await Batch.find({ isActive: true })
        .select("_id")
        .lean();

      const batchIds = batches.map(b => b._id);

      const scheduledBatches = await RoutineSlot.distinct("batches", {
        isActive: true,
        batches: { $in: batchIds }
      });

      return batches.length - scheduledBatches.length;
    })(),

    (async () => {
      const teachers = await Teacher.find({
        isActive: true,
        subjects: { $exists: true, $ne: [] }
      })
        .select("_id")
        .lean();

      const teacherIds = teachers.map(t => t._id);

      const scheduledTeachers = await RoutineSlot.distinct("teachers", {
        isActive: true,
        teachers: { $in: teacherIds }
      });

      return teachers.length - scheduledTeachers.length;
    })()
  ]);

  const blockingIssues = [];

  if (orphanRoutinesCount > 0)
    blockingIssues.push("Orphan routines exist");

  if (incompleteRoutinesCount > 0)
    blockingIssues.push("Incomplete routines exist");

  if (batchConflictsCount > 0)
    blockingIssues.push("Batch time conflicts exist");

  if (teacherConflictsCount > 0)
    blockingIssues.push("Teacher time conflicts exist");

  if (subjectsAssignedNotScheduledCount > 0)
    blockingIssues.push("Some subjects assigned but not scheduled");

  const isReady = blockingIssues.length === 0;

  return successResponse(res, {
    message: "Schedule readiness report generated successfully",
    data: {
      isReady,
      blockingIssues,
      metrics: {
        orphanRoutinesCount,
        incompleteRoutinesCount,
        batchConflictsCount,
        teacherConflictsCount,
        subjectsAssignedNotScheduledCount,
        batchesWithoutRoutinesCount,
        teachersWithoutRoutinesCount
      }
    }
  });
});

const getCleanupPreview = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;

  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const orphanRoutines = await RoutineSlot.find({
    isActive: true,
    subject: null,
    batches: { $size: 0 },
    teachers: { $size: 0 }
  })
    .select("_id day startTime endTime updatedAt")
    .sort({ updatedAt: 1 });

  const oldSoftDeletedRoutines = await RoutineSlot.find({
    isActive: false,
    deletedAt: { $lte: cutoffDate }
  })
    .select("_id day startTime endTime deletedAt deleteReason")
    .sort({ deletedAt: 1 });

  return successResponse(res, {
    message: "Cleanup preview generated successfully",
    data: {
      criteria: {
        orphanRoutines: "Active routines with no subject, batches, or teachers",
        softDeletedRetentionDays: days
      },
      summary: {
        orphanRoutinesCount: orphanRoutines.length,
        oldSoftDeletedRoutinesCount: oldSoftDeletedRoutines.length
      },
      candidates: {
        orphanRoutines,
        oldSoftDeletedRoutines
      }
    }
  });
});




export {
  getBranches,
  getBranchById,

  // ─────────────── ROUTINE DURABILITY ───────────────
  getSoftDeletedRoutines,
  getOrphanRoutines,
  getIncompleteRoutines,
  getRoutinesWithoutBatches,
  getRoutinesWithoutTeachers,
  getRoutinesWithoutSubject,
  getRoutineConflicts,

  // ─────────────── SUBJECT DURABILITY ───────────────
  getSubjectsWithoutRoutines,
  getSubjectsWithoutTeachers,
  getSubjectsAssignedButNotScheduled,

  // ─────────────── TEACHER DURABILITY ───────────────
  getTeachersWithoutRoutines,
  getTeachersAssignedButNotScheduled,
  getTeacherConflicts,

  // ─────────────── BATCH DURABILITY ───────────────
  getBatchesWithoutRoutines,
  getBatchesWithSubjectNotScheduled,
  getBatchConflicts,

  // ─────────────── SYSTEM / AUDIT ───────────────
  getDanglingRoutineReferences,
  getEmptyCollectionsAudit,
  getRecentlyModifiedSchedulingEntities,

  // ─────────────── HEALTH / CLEANUP ───────────────
  getScheduleReadinessReport,
  getCleanupPreview
};
