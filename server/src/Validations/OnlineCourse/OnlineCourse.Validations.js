import Joi from "joi";

/* ------------------ COMMON HELPERS ------------------ */

export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});

export const dateField = Joi.date().messages({
  "date.base": "Value must be a valid date",
});

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});

/* ------------------ CORE REFERENCES ------------------ */

export const studentId = objectId.messages({
  "any.only": "Invalid student reference",
});

export const teacher = Joi.array().items(objectId).messages({
  "array.base": "Teacher must be an array of teacher IDs",
});

export const routine = objectId.messages({
  "any.only": "Invalid routine reference",
});

export const payment = objectId.messages({
  "any.only": "Invalid payment reference",
});

/* ------------------ COURSE DETAILS ------------------ */

export const courseName = Joi.string().trim().min(2).max(150).messages({
  "string.base": "Course name must be a string",
  "string.min": "Course name must be at least 2 characters long",
  "string.max": "Course name must not exceed 150 characters",
});

export const price = positiveNumber.messages({
  "number.base": "Price must be a number",
});

/* ------------------ META ------------------ */

export const purchasedAt = dateField.messages({
  "date.base": "Purchase date must be a valid date",
});
