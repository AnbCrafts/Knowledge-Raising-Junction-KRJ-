import jwt from "jsonwebtoken";

const ACCESS_EXPIRY = "15m";
const REFRESH_EXPIRY = "7d";
const TEMP_EXPIRY = "5m"; 

export const generateTokens = (user) => {
  
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, branch: user.branch, type: "ACCESS" },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_EXPIRY }
  );

  
  const refreshToken = jwt.sign(
    { id: user._id, type: "REFRESH" },
    process.env.REFRESH_SECRET,
    { expiresIn: REFRESH_EXPIRY }
  );

  return { accessToken, refreshToken };
};


export const generateTempToken = (userId) => {
  return jwt.sign(
    { id: userId, type: "TEMP_2FA" },
    process.env.JWT_SECRET,
    { expiresIn: TEMP_EXPIRY }
  );
};

export const verifyToken = (token, secret = process.env.JWT_SECRET) => {
  return jwt.verify(token, secret);
};