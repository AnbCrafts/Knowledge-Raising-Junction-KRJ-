import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import { Employee } from "../../../Schema/Employee/Employee.Schema.js";
import { User } from "../../../Schema/User/User.Schema.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";
import { checkAdminPermission } from "../Admin.Utils.js";
import { objectId } from "../../../Validations/User/User.Validations.js";
import Joi from "joi";

const getAllEmployees = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_employees");

  const { page = 1, limit = 10, branchId, department, designation } = req.query;

  const query = {};

  if (branchId) {
    query.branches = branchId;
  }
  if (department) {
    query.department = department;
  }
  if (designation) {
    query.designation = designation;
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: "userId", select: "fullName email phone" },
      { path: "branches", select: "name branchCode" },
    ],
    lean: true,
  };

  const skip = (options.page - 1) * options.limit;

  const employees = await Employee.find(query)
    .sort(options.sort)
    .skip(skip)
    .limit(options.limit)
    .populate(options.populate)
    .lean();

  const total = await Employee.countDocuments(query);

  return successResponse(res, {
    message: "Employees fetched successfully",
    data: {
      employees,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        pages: Math.ceil(total / options.limit),
      },
    },
  });
});

const getEmployeeProfile = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_employees");

  const { employeeId } = req.params;
  const { error } = objectId.required().validate(employeeId);
  if (error) throw new ApiError(400, "Invalid Employee ID");

  const employee = await Employee.findById(employeeId)
    .populate({
      path: "userId",
      select: "-password -__v",
    })
    .populate("branches")
    .lean();

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  return successResponse(res, {
    message: "Employee profile fetched successfully",
    data: employee,
  });
});

const updateEmployee = asyncHandler(async (req, res) => {
  await checkAdminPermission(req.user._id, "manage_employees");

  const { employeeId } = req.params;
  const { error: idError } = objectId.required().validate(employeeId);
  if (idError) throw new ApiError(400, "Invalid Employee ID");

  const schema = Joi.object({
    fullName: Joi.string().optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().optional(),
    designation: Joi.string().optional(),
    department: Joi.string().optional(),
    employmentType: Joi.string().optional(),
    salaryAmount: Joi.number().optional(),
  }).unknown(true);

  const { error, value } = schema.validate(req.body);
  if (error) throw new ApiError(400, "Validation failed", error.details);

  const employee = await Employee.findById(employeeId);
  if (!employee) throw new ApiError(404, "Employee not found");

  // Update User
  if (value.fullName || value.email || value.phone) {
    await User.findByIdAndUpdate(employee.userId, {
      ...(value.fullName && { fullName: value.fullName }),
      ...(value.email && { email: value.email }),
      ...(value.phone && { phone: value.phone }),
    });
  }

  // Update Employee
  if (value.designation) employee.designation = value.designation;
  if (value.department) employee.department = value.department;
  if (value.employmentType) employee.employmentType = value.employmentType;
  if (value.salaryAmount) employee.salaryAmount = value.salaryAmount;

  await employee.save();

  return successResponse(res, {
    message: "Employee updated successfully",
  });
});

export { getAllEmployees, getEmployeeProfile, updateEmployee };
