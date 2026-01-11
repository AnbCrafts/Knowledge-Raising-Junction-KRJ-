import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../../Schema/Management/Student/Student.Schema.js";
import { studentQueryValidationSchema } from "../../../Validations/Admission/Student.Query.Validation.js";

const getStudents = asyncHandler(async (req, res) => {
  // 1️⃣ Validate query
  const { error, value } = studentQueryValidationSchema.validate(req.query, {
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
    branchId,
    teacherId,
    status,
    from,
    to,
    page = 1,
    limit = 20,
    sortBy = "createdAt",
    order = "desc",
  } = value;

  // Coerce pagination values to numbers
  const pageNum = Number.isFinite(Number(page)) && Number(page) > 0 ? parseInt(page, 10) : 1;
  const limitNum = Number.isFinite(Number(limit)) && Number(limit) > 0 ? parseInt(limit, 10) : 20;

  // 2️⃣ Build query (same as Branch)
  const query = {};

  if (branchId) query.branch = branchId;
  if (teacherId) query.assignedTeacher = teacherId;
  if (status) query.status = status;

  if (from || to) {
    query.createdAt = {};
    if (from) query.createdAt.$gte = new Date(from);
    if (to) query.createdAt.$lte = new Date(to);
  }

  // 3️⃣ Pagination & sorting
  const skip = (pageNum - 1) * limitNum;
  const sortOrder = order === "asc" ? 1 : -1;

  // 4️⃣ Fetch data + count
  const [students, total] = await Promise.all([
    Student.find(query)
      .populate("branch", "name branchCode")
      .populate("academicProfile", "academicYear currentClassYear")
      .populate("idCard", "idNumber status")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Student.countDocuments(query),
  ]);

  // 5️⃣ Response
  // Sanitize students (remove sensitive/internal fields)
  const sanitizedStudents = (students || []).map((s) => {
    if (s.password) delete s.password;
    if (s.__v !== undefined) delete s.__v;
    return s;
  });

  return successResponse(res, {
    message: "Students fetched successfully",
    data: {
      total,
      page: pageNum,
      limit: limitNum,
      students: sanitizedStudents,
    },
  });
});

export default getStudents;
