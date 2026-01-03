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

export const dateField = Joi.date().messages({
  "date.base": "Value must be a valid date",
});

/* ------------------ CORE BRANCH FIELDS ------------------ */

export const name = Joi.string().trim().min(2).max(100).required().messages({
  "string.base": "Branch name must be a string",
  "string.empty": "Branch name is required",
  "string.min": "Branch name must be at least 2 characters long",
  "string.max": "Branch name must not exceed 100 characters",
});

export const address = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Address must be a string",
  "string.max": "Address must not exceed 500 characters",
}); 

/* ------------------ RELATIONSHIPS ------------------ */

export const batches = Joi.array().items(objectId).messages({
  "array.base": "Batches must be an array of batch IDs",
});

export const students = Joi.array().items(objectId).messages({
  "array.base": "Students must be an array of student IDs",
});

export const teachers = Joi.array().items(objectId).messages({
  "array.base": "Teachers must be an array of teacher IDs",
});

export const employees = Joi.array().items(objectId).messages({
  "array.base": "Employees must be an array of employee IDs",
});

export const managedBy = Joi.array().items(objectId).messages({
  "array.base": "ManagedBy must be an array of admin IDs",
});

/* ------------------ STATUS & META ------------------ */

export const isActive = booleanField;

export const deletedAt = dateField.allow(null).messages({
  "date.base": "DeletedAt must be a valid date",
});
export const branchCode = Joi.string()
  .trim()
  .pattern(/^KRJ-\d{4}-[A-Z]{2,5}-\d{2}$/)
  .messages({
    "string.base": "Branch code must be a string",
    "string.empty": "Branch code is required",
    "string.pattern.base":
      "Branch code must be in format KRJ-YYYY-ADD-XX (e.g. KRJ-2025-GOV-01)",
  });
export const areaCode = Joi.string()
  .trim()
  .uppercase()
  .length(3)
  .pattern(/^[A-Z]{3}$/)
  .messages({
    "string.base": "Area code must be a string",
    "string.empty": "Area code is required",
    "string.length": "Area code must be exactly 3 characters",
    "string.pattern.base":
      "Area code must contain only uppercase letters (e.g. GOV, CTY)",
  });
