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

/* ------------------ TEST DETAILS ------------------ */

export const testName = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Test name must be a string",
  "string.min": "Test name must be at least 2 characters long",
  "string.max": "Test name must not exceed 100 characters",
});

export const subject = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Subject must be a string",
  "string.min": "Subject must be at least 2 characters long",
  "string.max": "Subject must not exceed 100 characters",
});

/* ------------------ MARKS ------------------ */

export const totalMarks = positiveNumber.messages({
  "number.base": "Total marks must be a number",
});

export const obtainedMarks = positiveNumber.messages({
  "number.base": "Obtained marks must be a number",
});

/* ------------------ DATE & REMARKS ------------------ */

export const testDate = dateField.messages({
  "date.base": "Test date must be a valid date",
});

export const remarks = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});
