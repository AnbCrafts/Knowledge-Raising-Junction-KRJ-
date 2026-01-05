import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import { booleanField, dateField,objectId } from "../../Validations/Batch/Batch.Validations";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

const getBatchValidationSchema = Joi.object({
  branchId: objectId.optional(),          // matches branches[]
  isActive: booleanField.optional(),

  subjectId: objectId.optional(),         // matches subjects[]
  studentId: objectId.optional(),         // matches students[]
  teacherId: objectId.optional(),         // matches mentors[]

  createdBy: objectId.optional(),         // single admin
  managedBy: objectId.optional(),         // admin inside managedBy[]

  startFrom: dateField.optional(),
  startTo: dateField.optional(),

  code: code.optional(),                  // batch code
  search: Joi.string().trim().min(1).optional(),

  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(20),
});

const getAllBatches = asyncHandler(async (req, res) => {

  const buildBatchQuery = (filters) => {
    const query = {};

    if (filters.branchId) {
      query.branches = filters.branchId;
    }

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    if (filters.subjectId) {
      query.subjects = filters.subjectId;
    }

    if (filters.teacherId) {
      query.mentors = filters.teacherId;
    }

    if (filters.studentId) {
      query.students = filters.studentId;
    }

    if (filters.createdBy) {
      query.createdBy = filters.createdBy;
    }

    if (filters.managedBy) {
      query.managedBy = filters.managedBy;
    }

    if (filters.code) {
      query.code = filters.code;
    }

    if (filters.startFrom || filters.startTo) {
      query.startDate = {};
      if (filters.startFrom) query.startDate.$gte = filters.startFrom;
      if (filters.startTo) query.startDate.$lte = filters.startTo;
    }

    if (filters.search) {
      query.$or = [
        { name: new RegExp(filters.search, "i") },
        { code: new RegExp(filters.search, "i") },
      ];
    }

    return query;
  };

  const { error, value } = getBatchValidationSchema.validate(req.query, {
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

  const { page, limit, ...filters } = value;

  const query = buildBatchQuery(filters);
  const skip = (page - 1) * limit;

  const [batches, total] = await Promise.all([
    Batch.find(query)
      .populate("branches", "name code")
      .populate("mentors", "fullName")
      .populate("subjects", "name")
      .populate("students", "fullName")
      .populate("createdBy", "fullName email")
      .populate("managedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    Batch.countDocuments(query),
  ]);

  return successResponse(res, {
    message: "Batches fetched successfully",
    data: batches,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
});

const getBatchById = asyncHandler(async (req, res) => {
  const { batchId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(batchId)) {
    throw new ApiError(400, "Invalid batch ID");
  }

  const batch = await Batch.findById(batchId)
    .populate("branches", "name code")
    .populate("mentors", "firstName lastName email")
    .populate("students", "firstName lastName email")
    .populate("createdBy", "firstName lastName email");

  if (!batch) {
    throw new ApiError(404, "Batch not found");
  }

  return successResponse(res, 200, "Batch fetched successfully", batch);
});

const getBatchesByMember = asyncHandler(async (req, res) => {
  const { memberId, memberType } = req.query;

  if (!memberId || !memberType) {
    throw new ApiError(400, "memberId and memberType are required");
  }

  if (!["student", "teacher","admin"].includes(memberType)) {
    throw new ApiError(400, "memberType must be student or teacher");
  }

  if (!mongoose.Types.ObjectId.isValid(memberId)) {
    throw new ApiError(400, "Invalid member ID");
  }

  const query = {
    ...(memberType === "student" && { students: memberId }),
    ...(memberType === "teacher" && { mentors: memberId }),
    ...(memberType === "admin" && { managedBy: memberId }),
  };

  const {
    page = 1,
    limit = 10,
    isActive
  } = req.query;

  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const skip = (page - 1) * limit;

  const [batches, total] = await Promise.all([
    Batch.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 }),
    Batch.countDocuments(query)
  ]);

  return successResponse(res, 200, "Batches fetched successfully", {
    data: batches,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit),
    },
  });
});



export {getAllBatches,getBatchById,getBatchesByMember}