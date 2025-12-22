import Joi from "joi";



export const objectId = Joi.string().hex().length(24).messages({
  "string.base": "ID must be a string",
  "string.hex": "ID must be a valid hexadecimal value",
  "string.length": "ID must be a valid 24-character ObjectId",
});

export const booleanField = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});

/* ------------------ CORE REFERENCE ------------------ */

export const studentId = objectId.required().messages({
  "any.required": "Student reference is required",
});

/* ------------------ CURRENT ACADEMIC STATUS ------------------ */

export const academicYear = Joi.string()
  .trim()
  .pattern(/^\d{4}-\d{4}$/)
  .required()
  .messages({
    "string.empty": "Academic year is required",
    "string.pattern.base":
      "Academic year must be in the format YYYY-YYYY (e.g. 2024-2025)",
  });

export const currentClassYear = Joi.string().trim().min(1).max(20).required().messages({
  "string.empty": "Current class/year is required",
  "string.max": "Current class/year must not exceed 20 characters",
});

export const board = objectId.required().messages({
  "any.required": "Board reference is required",
});

export const course = objectId.messages({
  "any.only": "Invalid course reference",
});

export const medium = Joi.string()
  .valid("ENGLISH", "HINDI", "OTHER")
  .messages({
    "any.only": "Medium must be ENGLISH, HINDI, or OTHER",
  });

/* ------------------ PREVIOUS ACADEMICS ------------------ */

export const previousAcademicRecord = Joi.object({
  academicYear: Joi.string()
    .trim()
    .pattern(/^\d{4}-\d{4}$/)
    .messages({
      "string.pattern.base":
        "Academic year must be in the format YYYY-YYYY",
    }),

  classYear: Joi.string().trim().max(20).messages({
    "string.base": "Class year must be a string",
    "string.max": "Class year must not exceed 20 characters",
  }),

  board: objectId.messages({
    "any.only": "Invalid board reference",
  }),

  schoolOrCollegeName: Joi.string().trim().max(200).messages({
    "string.base": "School/college name must be a string",
    "string.max": "School/college name must not exceed 200 characters",
  }),

  marksObtained: positiveNumber.messages({
    "number.base": "Marks obtained must be a number",
  }),

  totalMarks: positiveNumber.messages({
    "number.base": "Total marks must be a number",
  }),

  percentage: Joi.number().min(0).max(100).messages({
    "number.base": "Percentage must be a number",
    "number.min": "Percentage cannot be less than 0",
    "number.max": "Percentage cannot exceed 100",
  }),

  resultStatus: Joi.string()
    .valid("PASS", "FAIL", "APPEARING")
    .messages({
      "any.only": "Result status must be PASS, FAIL, or APPEARING",
    }),
});

export const previousAcademics = Joi.array().items(previousAcademicRecord).messages({
  "array.base": "Previous academics must be an array of academic records",
});

/* ------------------ STATUS & META ------------------ */

export const isActive = booleanField;

export const remarks = Joi.string().trim().max(1000).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 1000 characters",
});
