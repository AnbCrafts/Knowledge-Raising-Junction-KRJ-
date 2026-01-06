import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import { objectId } from "../../Validations/Subject/Subject.Validations.js";

const getSubjectById = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  // validate subjectId using your validator
  const { error } = objectId.required().validate(subjectId);
  if (error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const subject = await Subject.findById(subjectId)
  .populate({
    path: "teachers",
    select: "userId",
    populate: {
      path: "userId",
      select: "firstName lastName email"
    }
  })
  .populate("batches", "name code")
  .populate("routines", "day startTime endTime")
  .populate({
    path: "createdBy",
    select: "userId",
    populate: {
      path: "userId",
      select: "firstName lastName email"
    }
  });


  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return successResponse(
    res,
    200,
    "Subject fetched successfully",
    subject
  );
});

 const getSubjects = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    type,
    teacherId,
    batchId,
    routineId,
    isActive,
    search
  } = req.query;

  const query = {};

  // -------- FILTERS --------

  if (type) {
    query.type = type;
  }

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  if (teacherId) {
    const { error } = objectId.required().validate(teacherId);
    if (error) throw new ApiError(400, "Invalid teacher ID");
    query.teachers = teacherId;
  }

  if (batchId) {
    const { error } = objectId.required().validate(batchId);
    if (error) throw new ApiError(400, "Invalid batch ID");
    query.batches = batchId;
  }

  if (routineId) {
    const { error } = objectId.required().validate(routineId);
    if (error) throw new ApiError(400, "Invalid routine ID");
    query.routines = routineId;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } }
    ];
  }

  // -------- PAGINATION --------

  const skip = (Number(page) - 1) * Number(limit);

  const [subjects, total] = await Promise.all([
    Subject.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "teachers",
        select: "userId",
        populate: {
          path: "userId",
          select: "firstName lastName email"
        }
      })
      .populate("batches", "name code")
      .populate("routines", "day startTime endTime")
      .lean(),

    Subject.countDocuments(query)
  ]);

  return successResponse(res, 200, "Subjects fetched successfully", {
    data: subjects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});
 const getSubjectsByIdentifier = asyncHandler(async (req, res) => {
  const { identifier, id } = req.params;
  const {
    page = 1,
    limit = 10
  } = req.query;

  // 1️⃣ Validate identifier
  const identifierMap = {
    teacher: "teachers",
    batch: "batches",
    routine: "routines"
  };

  const subjectField = identifierMap[identifier];

  if (!subjectField) {
    throw new ApiError(
      400,
      "Invalid identifier. Allowed: teacher, batch, routine"
    );
  }

  // 2️⃣ Validate ID
  const { error } = objectId.required().validate(id);
  if (error) {
    throw new ApiError(400, `Invalid ${identifier} ID`);
  }

  // 3️⃣ Build query
  const query = {
    [subjectField]: id
  };

  // 4️⃣ Pagination
  const skip = (Number(page) - 1) * Number(limit);

  const [subjects, total] = await Promise.all([
    Subject.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate({
        path: "teachers",
        select: "userId",
        populate: {
          path: "userId",
          select: "firstName lastName email"
        }
      })
      .populate("batches", "name code")
      .populate("routines", "day startTime endTime")
      .lean(),

    Subject.countDocuments(query)
  ]);

  return successResponse(res, 200, "Subjects fetched successfully", {
    data: subjects,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  });
});

 const getSubjectOptions = asyncHandler(async (req, res) => {
  const { isActive } = req.query;

  const query = {};

  // optional filter
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const subjects = await Subject.find(query)
    .select("_id name code")
    .sort({ name: 1 })
    .lean();

  return successResponse(
    res,
    200,
    "Subject options fetched successfully",
    subjects
  );
});

export {getSubjectById, getSubjects,getSubjectsByIdentifier,getSubjectOptions}