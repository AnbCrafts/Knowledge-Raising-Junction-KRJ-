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


export {getBranches,getBranchById}