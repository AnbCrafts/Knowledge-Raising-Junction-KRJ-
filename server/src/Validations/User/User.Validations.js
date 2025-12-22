import Joi from "joi";


export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});

export const booleanField = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});

/* ------------------ CORE USER FIELDS ------------------ */

export const fullName = Joi.string().trim().min(3).max(100).messages({
  "string.base": "Full name must be a string",
  "string.empty": "Full name is required",
  "string.min": "Full name must be at least 3 characters long",
  "string.max": "Full name must not exceed 100 characters",
});

export const email = Joi.string().email().trim().lowercase().messages({
  "string.base": "Email must be a string",
  "string.email": "Email must be a valid email address",
  "string.empty": "Email is required",
});

export const phone = Joi.string().pattern(/^[0-9]{10,15}$/).messages({
  "string.base": "Phone number must be a string",
  "string.pattern.base": "Phone number must contain 10 to 15 digits",
});

export const username = Joi.string().alphanum().min(3).max(30).trim().messages({
  "string.base": "Username must be a string",
  "string.alphanum": "Username can contain only letters and numbers",
  "string.min": "Username must be at least 3 characters long",
  "string.max": "Username must not exceed 30 characters",
});

export const password = Joi.string().min(8).messages({
  "string.base": "Password must be a string",
  "string.min": "Password must be at least 8 characters long",
  "string.empty": "Password is required",
});

/* ------------------ ROLE & PERMISSIONS ------------------ */

export const role = Joi.string().valid("STUDENT", "TEACHER", "ADMIN").messages({
  "string.base": "Role must be a string",
  "any.only": "Role must be STUDENT, TEACHER, or ADMIN",
});

export const permissions = Joi.array().items(Joi.string()).messages({
  "array.base": "Permissions must be an array of strings",
});

/* ------------------ PROFILE REFERENCES ------------------ */

export const teacherProfile = objectId.allow(null).messages({
  "any.only": "Invalid teacher profile reference",
});

export const studentProfile = objectId.allow(null).messages({
  "any.only": "Invalid student profile reference",
});

/* ------------------ STATUS & FLAGS ------------------ */

export const isActive = booleanField;
export const isVerified = booleanField;

export const deletedAt = Joi.date().allow(null).messages({
  "date.base": "DeletedAt must be a valid date",
});

export const lastLogin = Joi.date().messages({
  "date.base": "Last login must be a valid date",
});

/* ------------------ SECURITY FIELDS ------------------ */

export const loginAttempts = Joi.number().integer().min(0).messages({
  "number.base": "Login attempts must be a number",
  "number.min": "Login attempts cannot be negative",
});

export const lockUntil = Joi.date().messages({
  "date.base": "LockUntil must be a valid date",
});

export const lastPasswordChange = Joi.date().messages({
  "date.base": "Last password change must be a valid date",
});

export const resetToken = Joi.string().messages({
  "string.base": "Reset token must be a string",
});

export const resetTokenExpiry = Joi.date().messages({
  "date.base": "Reset token expiry must be a valid date",
});

export const otpCode = Joi.string().length(6).messages({
  "string.base": "OTP must be a string",
  "string.length": "OTP must be exactly 6 digits",
});

export const otpExpiry = Joi.date().messages({
  "date.base": "OTP expiry must be a valid date",
});

export const twoFactorEnabled = booleanField;

export const twoFactorSecret = Joi.string().messages({
  "string.base": "Two-factor secret must be a string",
});

/* ------------------ AUDIT FIELDS ------------------ */

export const createdBy = objectId.messages({
  "any.only": "Invalid createdBy user reference",
});

export const updatedBy = objectId.messages({
  "any.only": "Invalid updatedBy user reference",
});
