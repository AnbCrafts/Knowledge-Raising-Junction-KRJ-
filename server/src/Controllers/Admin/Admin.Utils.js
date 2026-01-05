import { Admin } from "../../Schema/Admin/Admin.Schema.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";

// Helper to check Admin Permissions
export const checkAdminPermission = async (
  userId,
  requiredPermission = null
) => {
  const admin = await Admin.findOne({ userId }).lean();
  if (!admin) {
    throw new ApiError(403, "Access denied. Not an Admin.");
  }
  if (!admin.isActive) {
    throw new ApiError(403, "Admin account is inactive.");
  }
  if (
    requiredPermission &&
    !admin.permissions.includes(requiredPermission) &&
    admin.role !== "super_admin"
  ) {
    throw new ApiError(
      403,
      `Access denied. Missing permission: ${requiredPermission}`
    );
  }
  return admin;
};
