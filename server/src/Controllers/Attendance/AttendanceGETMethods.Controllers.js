import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";

/* ======================================================
   VALIDATION SCHEMA (Handles all filters)
====================================================== */
const attendanceQuerySchema = Joi.object({
  attendeeType: Joi.string().valid("STUDENT", "TEACHER", "EMPLOYEE").optional(),
  attendeeId: Joi.string().length(24).optional(),

  branch: Joi.string().length(24).optional(),
  batch: Joi.string().length(24).optional(),
  subject: Joi.string().length(24).optional(),

  date: Joi.date().optional(),
  from: Joi.date().optional(),
  to: Joi.date().optional(),

  status: Joi.string()
    .valid("PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE")
    .optional(),

  search: Joi.string().optional(), // search remarks

  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(200).default(20),

  sortBy: Joi.string()
    .valid("date", "createdAt", "updatedAt", "status")
    .default("date"),

  order: Joi.string().valid("asc", "desc").default("desc"),
});

/* ======================================================
   ONE ROUTE → ALL GET METHODS
====================================================== */

export const getAttendance = asyncHandler(async (req, res) => {
  // 1️⃣ VALIDATE QUERY
  const { error, value } = attendanceQuerySchema.validate(req.query, {
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

  // Extract validated values
  const {
    attendeeType,
    attendeeId,
    branch,
    batch,
    subject,
    date,
    from,
    to,
    status,
    search,
    page,
    limit,
    sortBy,
    order,
  } = value;

  // 2️⃣ BUILD MONGO QUERY OBJECT
  const query = {};

  // Person based filter
  if (attendeeType) query.attendeeType = attendeeType;
  if (attendeeId) query.attendeeId = attendeeId;

  // Location + class filters
  if (branch) query.branch = branch;
  if (batch) query.batch = batch;
  if (subject) query.subject = subject;

  // Status filter
  if (status) query.status = status;

  // Single date
  if (date) {
    query.date = new Date(date);
  }

  // Date range
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  // Search inside remarks
  if (search) query.remarks = { $regex: search, $options: "i" };

  // Pagination
  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  // 3️⃣ RUN QUERY (parallel for speed)
  const [data, total] = await Promise.all([
    Attendance.find(query)
      .populate("branch", "name branchCode")
      .populate("batch", "name code")
      .populate("subject", "name code")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Attendance.countDocuments(query),
  ]);

  // 4️⃣ SEND RESPONSE
  return successResponse(res, {
    message: "Attendance fetched successfully",
    filters: query,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data,
  });
});
