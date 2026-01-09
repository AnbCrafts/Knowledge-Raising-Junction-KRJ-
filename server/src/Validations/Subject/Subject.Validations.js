import Joi from "joi";

/* ------------------ COMMON HELPERS ------------------ */

export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});
export const dateField = Joi.date()
  .iso()
  .allow(null)
  .messages({
    "date.base": "Date must be a valid date",
    "date.format": "Date must be in ISO format"
  });
export const deleteReasonSchema = Joi.string()
  .trim()
  .min(10)
  .max(300)
  .required()
  .messages({
    "any.required": "Delete reason is required",
    "string.base": "Delete reason must be a string",
    "string.empty": "Delete reason cannot be empty",
    "string.min": "Delete reason must be at least 10 characters",
    "string.max": "Delete reason must be at most 300 characters"
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

export const subjectCode = Joi.string()
  .trim()
  .pattern(/^KRJ-(20\d{2})-[A-Z]{2,5}-\d{3}$/)
  .messages({
    "string.base": "Subject code must be a string",
    "string.empty": "Subject code is required",
    "string.pattern.base":
      "Subject code must be in format KRJ-YYYY-INITIALS-XXX (e.g. KRJ-2025-PHY-001)",
  });

export const subjectInitials = Joi.string()
  .trim()
  .uppercase()
  .pattern(/^[A-Z]{2,5}$/)
  .messages({
    "string.base": "Subject initials must be a string",
    "string.empty": "Subject initials are required",
    "string.pattern.base":
      "Subject initials must contain only 2 to 5 uppercase letters (e.g. PHY, CHE, MTH)",
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
export const createdBy = objectId.required().messages({
  "any.required": "Admin ID is required",
});

export const batches = Joi.array().items(objectId).messages({
  "array.base": "Batches must be an array of batch IDs",
});
export const routines = Joi.array().items(objectId).messages({
  "array.base": "Routines must be an array of Routine IDs",
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
