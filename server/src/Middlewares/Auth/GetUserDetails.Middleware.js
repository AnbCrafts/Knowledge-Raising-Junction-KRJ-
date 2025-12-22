import { User } from "../../Schema/User/User.Schema.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import jwt from "jsonwebtoken";



export const getUserDetails = asyncHandler(async (req, res, next) => {
  try {
    
    const token = 
      req.cookies?.accessToken || 
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await User.findById(decoded.id)
      .select("_id role") 
      .lean(); 

    if (!user) {
      throw new ApiError(401, "Unauthorized: User does not exist");
    }

    
    req.user = user;

    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});