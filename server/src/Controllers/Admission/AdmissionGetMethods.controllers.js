import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../Schema/Student/Student.Schema.js";
import { studentQueryValidationSchema } from "../../Validations/Admission/Student.Query.Validation.js";

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
  const skip = (page - 1) * limit;
  const sortOrder = order === "asc" ? 1 : -1;

  // 4️⃣ Fetch data + count
  const [students, total] = await Promise.all([
    Student.find(query)
      .populate("branch", "name branchCode")
      .populate("academicProfile", "academicYear currentClassYear")
      .populate("idCard", "idNumber status")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    Student.countDocuments(query),
  ]);

  // 5️⃣ Response
  return successResponse(res, {
    message: "Students fetched successfully",
    data: {
      total,
      page,
      limit,
      students,
    },
  });
});

export default getStudents;
