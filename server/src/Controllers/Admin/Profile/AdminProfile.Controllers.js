import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import Joi from "joi";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Validations
import {
  fullName,
  email,
  phone,
  username,
  password,
  createdBy,
} from "../../../Validations/User/User.Validations.js";
import {
  role,
  permissions,
  branches,
  settings,
  objectId,
  managedBy,
} from "../../../Validations/Admin/Admin.Validations.js";

// Models & Utils
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import { Admin } from "../../../Schema/Admin/Admin.Schema.js";
import { User } from "../../../Schema/User/User.Schema.js";
import { Employee } from "../../../Schema/Employee/Employee.Schema.js";
import { Branch } from "../../../Schema/Branch/Branch.Schema.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

// VALIDATIONS

const createAdminValidationSchema = Joi.object({
  fullName: fullName.required(),
  email: email.required(),
  username: username.required(),
  password: password.required(),
  phone: phone.required(),
  role: role.required(), // Admin role (super_admin, manager, etc.)
  permissions: permissions.optional(),
  branches: branches.optional(),
  managedBy: managedBy.optional(),
  settings: settings.optional(),
  createdBy: createdBy.required(),
  employeeId: objectId.optional(), // If linking to an existing employee
});

const updateAdminValidationSchema = Joi.object({
  role: role.optional(),
  permissions: permissions.optional(),
  branches: branches.optional(),
  managedBy: managedBy.optional(),
  settings: settings.optional(),
  isActive: Joi.boolean().optional(),
});

// METHODS

const createAdmin = asyncHandler(async (req, res) => {
  let session;
  try {
    // 1. Start Session
    session = await mongoose.startSession();
    session.startTransaction();

    // 2. Validate Input
    const { error, value } = createAdminValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const {
      fullName,
      email,
      username,
      password,
      phone,
      role,
      permissions,
      branches,
      managedBy,
      settings,
      createdBy,
      employeeId,
    } = value;

    // Check if creator is a valid admin (optional security check, usually handled by middleware)
    // For now, we assume middleware handles authentication, but we check if createdBy exists
    const creator = await User.findById(createdBy).session(session);
    if (!creator) {
      throw new ApiError(400, "Invalid creator ID");
    }

    // 3. Check for Existing User
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    }).session(session);

    if (existingUser) {
      throw new ApiError(
        409,
        "User with this email or username already exists"
      );
    }

    // 4. Create User
    const SALT_ROUNDS = Number(process.env.BCRYPT_SALT) || 10;
    const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

    const newUsers = await User.create(
      [
        {
          fullName,
          email,
          username,
          password: hashedPass,
          phone,
          role: "ADMIN", // Force User role to ADMIN
          createdBy,
        },
      ],
      { session }
    );

    const createdUser = newUsers[0];

    if (!createdUser) {
      throw new ApiError(500, "User Profile Creation failed");
    }

    // 5. Create Admin Profile
    const newAdmins = await Admin.create(
      [
        {
          userId: createdUser._id,
          employeeId: employeeId || null,
          role,
          permissions: permissions || [],
          branches: branches || [],
          managedBy: managedBy || null,
          settings: settings || {},
          createdBy,
          isActive: true,
        },
      ],
      { session }
    );

    const createdAdmin = newAdmins[0];

    if (!createdAdmin) {
      throw new ApiError(500, "Admin Profile Creation failed");
    }

    // 6. Link Employee if provided
    if (employeeId) {
      const employee = await Employee.findById(employeeId).session(session);
      if (!employee) {
        throw new ApiError(404, "Employee not found");
      }
      // Logic to link admin back to employee if needed, or just verify existence
    }

    // 7. Update Branches if provided
    if (branches && branches.length > 0) {
      // Note: Branch schema might not have an 'admins' field, but if it did, we would update it here.
      // For now, we just ensure branches exist.
      const count = await Branch.countDocuments({
        _id: { $in: branches },
      }).session(session);
      if (count !== branches.length) {
        throw new ApiError(400, "One or more branches not found");
      }
    }

    // 8. Commit Transaction
    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Admin created successfully",
      data: {
        userId: createdUser._id,
        adminId: createdAdmin._id,
        role: createdAdmin.role,
        email: createdUser.email,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});

const getAdminProfile = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const { error } = objectId.required().validate(adminId);
  if (error) {
    throw new ApiError(400, "Invalid Admin ID");
  }

  const admin = await Admin.findById(adminId)
    .populate({
      path: "userId",
      select: "-password -__v",
    })
    .populate({
      path: "branches",
      select: "name code",
    })
    .populate({
      path: "managedBy",
      select: "role", // Avoid deep nesting, just get role or basic info
    })
    .lean();

  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  return successResponse(res, {
    message: "Admin profile fetched successfully",
    data: admin,
  });
});

const getAllAdmins = asyncHandler(async (req, res) => {
  const { role, branchId, isActive, page = 1, limit = 10 } = req.query;

  const query = { deletedAt: null }; // Only fetch non-deleted admins

  if (role) {
    query.role = role;
  }
  if (branchId) {
    query.branches = branchId;
  }
  if (isActive !== undefined) {
    query.isActive = isActive === "true";
  }

  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
    sort: { createdAt: -1 },
    populate: [
      { path: "userId", select: "fullName email phone" },
      { path: "branches", select: "name code" },
    ],
    lean: true,
  };

  // Using mongoose-paginate-v2 if available, or manual pagination
  // Since I don't see pagination plugin usage in Employee controller, I'll do manual
  const skip = (options.page - 1) * options.limit;

  const admins = await Admin.find(query)
    .sort(options.sort)
    .skip(skip)
    .limit(options.limit)
    .populate(options.populate)
    .lean();

  const total = await Admin.countDocuments(query);

  return successResponse(res, {
    message: "Admins fetched successfully",
    data: {
      admins,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        pages: Math.ceil(total / options.limit),
      },
    },
  });
});

const updateAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const { error: idError } = objectId.required().validate(adminId);
  if (idError) throw new ApiError(400, "Invalid Admin ID");

  const { error, value } = updateAdminValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Validation failed",
      error.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Update fields
  if (value.role) admin.role = value.role;
  if (value.permissions) admin.permissions = value.permissions;
  if (value.branches) admin.branches = value.branches;
  if (value.managedBy) admin.managedBy = value.managedBy;
  if (value.settings) admin.settings = { ...admin.settings, ...value.settings };
  if (value.isActive !== undefined) admin.isActive = value.isActive;

  admin.updatedBy = req.user?._id; // Assuming req.user is populated by auth middleware

  await admin.save();

  return successResponse(res, {
    message: "Admin updated successfully",
    data: admin,
  });
});

const deleteAdmin = asyncHandler(async (req, res) => {
  const { adminId } = req.params;

  const { error } = objectId.required().validate(adminId);
  if (error) throw new ApiError(400, "Invalid Admin ID");

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // Soft delete
  admin.isActive = false;
  admin.deletedAt = new Date();
  admin.updatedBy = req.user?._id;

  await admin.save();

  // Also deactivate the User?
  // Usually yes, but let's stick to Admin profile for now.
  // If we want to block login, we should update User.isActive too.
  // Let's do that for completeness.
  await User.findByIdAndUpdate(admin.userId, { isActive: false });

  return successResponse(res, {
    message: "Admin deactivated successfully",
  });
});

export { createAdmin, getAdminProfile, getAllAdmins, updateAdmin, deleteAdmin };
