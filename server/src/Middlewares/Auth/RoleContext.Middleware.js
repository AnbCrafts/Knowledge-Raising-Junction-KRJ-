import jwt from "jsonwebtoken";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { User } from "../../Schema/User/User.Schema.js";

export const getRoleContext = (roleType) =>
  asyncHandler(async (req, res, next) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized");
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      throw new ApiError(401, "Invalid or expired token");
    }

    let fieldsToSelect;

    switch (roleType) {
      case "student":
        fieldsToSelect = "_id idCard branch batch userId role";
        break;
      case "teacher":
        fieldsToSelect = "_id batches userId role";
        break;
      case "employee":
        fieldsToSelect = "_id branches userId idCard role";
        break;
      default:
        throw new ApiError(500, "Invalid role context");
    }

    const user = await User.findById(decoded.id)
      .select(fieldsToSelect)
      .lean();

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    if (user.role !== roleType) {
      throw new ApiError(403, "Forbidden");
    }

    req.user = user;
    next();
  });
