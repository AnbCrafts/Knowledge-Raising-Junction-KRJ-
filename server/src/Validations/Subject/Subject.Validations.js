import Joi from "joi";

/* ------------------ COMMON HELPERS ------------------ */

export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});

export const booleanField = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});

/* ------------------ CORE SUBJECT FIELDS ------------------ */

export const name = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Subject name must be a string",
  "string.empty": "Subject name is required",
  "string.min": "Subject name must be at least 2 characters long",
  "string.max": "Subject name must not exceed 100 characters",
});

export const code = Joi.string().trim().min(2).max(20).messages({
  "string.base": "Subject code must be a string",
  "string.empty": "Subject code is required",
  "string.min": "Subject code must be at least 2 characters long",
  "string.max": "Subject code must not exceed 20 characters",
});

export const description = Joi.string().max(1000).allow("").messages({
  "string.base": "Description must be a string",
  "string.max": "Description must not exceed 1000 characters",
});

/* ------------------ SUBJECT TYPE ------------------ */

export const type = Joi.string()
  .valid("THEORY", "LAB", "SEMINAR", "OPTIONAL")
  .messages({
    "string.base": "Subject type must be a string",
    "any.only": "Subject type must be THEORY, LAB, SEMINAR, or OPTIONAL",
  });

/* ------------------ RELATIONSHIPS ------------------ */

export const branch = objectId.required().messages({
  "any.required": "Branch ID is required",
});

export const batch = objectId.required().messages({
  "any.required": "Batch ID is required",
});

export const teachers = Joi.array().items(objectId).messages({
  "array.base": "Teachers must be an array of teacher IDs",
});

export const students = Joi.array().items(objectId).messages({
  "array.base": "Students must be an array of student IDs",
});

/* ------------------ STATUS & PROGRESS ------------------ */

export const isActive = booleanField;

export const syllabusCompletion = Joi.number().min(0).max(100).messages({
  "number.base": "Syllabus completion must be a number",
  "number.min": "Syllabus completion cannot be less than 0%",
  "number.max": "Syllabus completion cannot exceed 100%",
});
