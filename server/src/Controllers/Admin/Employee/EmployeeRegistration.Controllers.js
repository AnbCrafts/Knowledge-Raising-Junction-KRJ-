import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import Joi from "joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Models
import { User } from "../../../Schema/User/User.Schema.js";
import { Employee } from "../../../Schema/Employee/Employee.Schema.js";
import CounterSchema from "../../../Schema/Counter/Counter.Schema.js";
import { Branch } from "../../../Schema/Branch/Branch.Schema.js";

// Utils
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";
import { checkAdminPermission } from "../Admin.Utils.js";

// Validations
import {
  fullName,
  email,
  phone,
  username,
  password,
  objectId,
} from "../../../Validations/User/User.Validations.js";

// ---------------- EMPLOYEE REGISTRATION ----------------

const registerEmployeeValidationSchema = Joi.object({
  fullName: fullName.required(),
  email: email.required(),
  username: username.required(),
  password: password.required(),
  phone: phone.required(),
  designation: Joi.string().required(),
  department: Joi.string().required(),
  branches: Joi.array().items(objectId).required(),
  employmentType: Joi.string().required(),
  joiningDate: Joi.date().required(),
  salaryType: Joi.string().required(),
  salaryAmount: Joi.number().required(),
}).unknown(true);

export const registerEmployee = asyncHandler(async (req, res) => {
  // 1. Strict Admin Check
  await checkAdminPermission(req.user._id, "manage_employees");

  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = registerEmployeeValidationSchema.validate(
      req.body
    );
    if (error) throw new ApiError(400, "Validation failed", error.details);

    const {
      fullName,
      email,
      username,
      password,
      phone,
      branches,
      joiningDate,
      ...empDetails
    } = value;

    // Check Existing
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).session(session);
    if (existingUser) throw new ApiError(409, "User exists");

    // Create User
    const hashedPass = await bcrypt.hash(password, 10);
    const newUsers = await User.create(
      [
        {
          fullName,
          email,
          username,
          password: hashedPass,
          phone,
          role: "EMPLOYEE",
          createdBy: req.user._id,
        },
      ],
      { session }
    );
    const createdUser = newUsers[0];

    // Generate Employee Code
    const year = new Date(joiningDate).getFullYear();
    const counter = await CounterSchema.findOneAndUpdate(
      { key: `EMPLOYEE_${year}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );
    const employeeCode = `KRJ-EMP-${year}-${String(counter.seq).padStart(3, "0")}`;

    // Create Employee
    const newEmployees = await Employee.create(
      [
        {
          userId: createdUser._id,
          employeeCode,
          branches,
          joiningDate,
          createdBy: req.user._id,
          ...empDetails,
        },
      ],
      { session }
    );
    const createdEmployee = newEmployees[0];

    // Update Branches
    await Branch.updateMany(
      { _id: { $in: branches } },
      { $addToSet: { employees: createdEmployee._id } },
      { session }
    );

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Employee registered successfully",
      data: { employeeId: createdEmployee._id, employeeCode },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});
