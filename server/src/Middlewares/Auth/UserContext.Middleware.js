import { verifyToken } from "../../Utility/JWT/JWTTokens.Utility.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";



const extractUser = (req, expectedType) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) throw new ApiError(401, "Unauthorized request");

  try {
    const decoded = verifyToken(token);
    
    // 🔒 CRITICAL: Check Token Type
    if (decoded.type !== expectedType) {
      throw new ApiError(403, `Invalid token type. Expected ${expectedType}`);
    }
    return decoded;
  } catch (error) {
    throw new ApiError(401, "Invalid or Expired Token");
  }
};



export const verifyTempAuth = asyncHandler(async (req, res, next) => {
  // Often passed in body for 2FA, but can be header. Let's assume Body or Header.
  const token = req.body.tempToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) throw new ApiError(401, "Temp token missing");

  try {
    const decoded = verifyToken(token);
    if (decoded.type !== "TEMP_2FA") throw new ApiError(403, "Not a 2FA Temp Token");
    req.user = decoded; // Contains { id, type: 'TEMP_2FA' }
    next();
  } catch (e) {
    throw new ApiError(401, "Invalid 2FA Session");
  }
});


export const verifyJWT = asyncHandler(async (req, res, next) => {
  const decoded = extractUser(req, "ACCESS");
  req.user = decoded; // Contains { id, role, branch, type: 'ACCESS' }
  next();
});


export const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Access Denied: Insufficient Permissions");
    }
    next();
  };
};


export const verifyBranch = (req, res, next) => {
  if (req.user.role === "SUPER_ADMIN") return next();

  const targetBranch = req.body.branchId || req.params.branchId || req.query.branchId;

  if (targetBranch && req.user.branch !== targetBranch) {
    throw new ApiError(403, "Access Denied: Cross-branch operation not allowed");
  }
  next();
};