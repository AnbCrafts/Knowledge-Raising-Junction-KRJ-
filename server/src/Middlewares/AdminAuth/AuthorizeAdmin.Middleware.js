import mongoose from "mongoose";
import { Admin } from "../../Schema/Admin/Admin.Schema.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";


/**
 * @param {Array<string>} requiredPermissions
 * @returns middleware
 * 
 * router.post(
  "/batches",
  adminAuth(["manage_batches"]),
  createBatch
);

 */



export const adminAuth = (requiredPermissions = []) => {
  return async (req, res, next) => {
    const adminId = req.user?._id || req.body?.createdBy;

    if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
      throw new ApiError(401, "Invalid or missing admin ID");
    }

    const admin = await Admin.findById(adminId).select(
      "_id role permissions isActive"
    );

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    if (admin.role !== "ADMIN") {
      throw new ApiError(403, "Access denied. Admins only");
    }

    if (!admin.isActive) {
      throw new ApiError(403, "Admin account is inactive");
    }

    // 🔐 Permission check (if required)
    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some(p =>
        admin.permissions.includes(p)
      );

      if (!hasPermission) {
        throw new ApiError(
          403,
          `Missing required permission: ${requiredPermissions.join(" or ")}`
        );
      }
    }

    // Attach admin info to request
    req.admin = {
      _id: admin._id,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
    };

    next();
  };
};
