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

export const booleanField = Joi.boolean().messages({
  "boolean.base": "Value must be true or false",
});

export const positiveNumber = Joi.number().min(1).messages({
  "number.base": "Value must be a number",
  "number.min": "Value must be at least 1",
});

/* ------------------ APPLICANT CONTEXT ------------------ */

export const applicantId = objectId.required().messages({
  "any.required": "Applicant ID is required",
});

export const applicantType = Joi.string()
  .valid("STUDENT", "TEACHER", "EMPLOYEE")
  .required()
  .messages({
    "any.only": "Applicant type must be STUDENT, TEACHER, or EMPLOYEE",
    "any.required": "Applicant type is required",
  });

/* ------------------ BRANCH CONTEXT ------------------ */

export const branch = objectId.required().messages({
  "any.required": "Branch reference is required",
});

/* ------------------ LEAVE DATES ------------------ */

export const startDate = dateField.required().messages({
  "any.required": "Leave start date is required",
});

export const endDate = dateField.required().messages({
  "any.required": "Leave end date is required",
});

export const durationDays = positiveNumber.required().messages({
  "any.required": "Leave duration (in days) is required",
});

/* ------------------ REASON ------------------ */

export const reason = Joi.string().trim().min(5).max(500).required().messages({
  "string.empty": "Leave reason is required",
  "string.min": "Leave reason must be at least 5 characters long",
  "string.max": "Leave reason must not exceed 500 characters",
});

/* ------------------ STATUS & APPROVAL ------------------ */

export const status = Joi.string()
  .valid("PENDING", "APPROVED", "REJECTED", "CANCELLED")
  .messages({
    "any.only":
      "Leave status must be PENDING, APPROVED, REJECTED, or CANCELLED",
  });

export const approvedBy = objectId.allow(null).messages({
  "any.only": "Invalid approvedBy admin reference",
});

export const approvalDate = dateField.allow(null).messages({
  "date.base": "Approval date must be a valid date",
});

/* ------------------ META ------------------ */

export const remarks = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});

export const isDeleted = booleanField;
