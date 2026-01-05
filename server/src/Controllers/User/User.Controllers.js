import { User } from "../../Schema/User/User.Schema.js";
import { generateTokens } from "../../Utility/JWT/JWTTokens.Utility.js";
import { comparePassword } from "../../Utility/Password/Password.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import { email, password } from "../../Validations/User/User.Validations.js";
import Joi from "joi";
import mongoose from "mongoose";

const loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

const loginUser = asyncHandler(async (req, res) => {
  let session;
  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const { error, value } = loginSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });
    if (error) {
      throw new ApiError(
        400,
        "Invalid input",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

    const { email, password } = value;
    const user = await User.findOne({ email })
      .select("+password")
      .session(session);
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    // 4. Generate Tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // 5. Update Last Login
    user.lastLogin = new Date();
    await user.save({ session });

    await session.commitTransaction();

    // 6. Set Cookies
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    const loggedInUser = await User.findById(user._id).select(
      "-password -twoFactorSecret"
    );

    return successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      data: {
        user: loggedInUser,
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    if (session) {
      await session.abortTransaction();
    }
    throw error;
  } finally {
    if (session) {
      session.endSession();
    }
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
      success: true,
      message: "User logged out successfully",
    });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return successResponse(res, {
    statusCode: 200,
    message: "User fetched successfully",
    data: { user: req.user },
  });
});

export { loginUser, logoutUser, getCurrentUser };
