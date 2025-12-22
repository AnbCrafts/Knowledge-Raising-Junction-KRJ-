import Joi from "joi";

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

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});
export const batch = objectId.required().messages({
  "any.required": "Batch reference is required",
});

export const subject = objectId.required().messages({
  "any.required": "Subject reference is required",
});

export const createdBy = objectId.required().messages({
  "any.required": "Teacher reference (createdBy) is required",
});

export const title = Joi.string().trim().min(3).max(150).required().messages({
  "string.empty": "Assignment title is required",
  "string.min": "Assignment title must be at least 3 characters long",
  "string.max": "Assignment title must not exceed 150 characters",
});

export const description = Joi.string().trim().max(2000).allow("").messages({
  "string.base": "Description must be a string",
  "string.max": "Description must not exceed 2000 characters",
});

export const dueDate = dateField.required().messages({
  "any.required": "Due date is required",
});

export const maxMarks = positiveNumber.messages({
  "number.base": "Maximum marks must be a number",
});

export const fileUrl = Joi.string().uri().messages({
  "string.uri": "File URL must be a valid URL",
});

export const isActive = booleanField;
export const assignment = objectId.required().messages({
  "any.required": "Assignment reference is required",
});

export const student = objectId.required().messages({
  "any.required": "Student reference is required",
});

export const submissionFileUrl = Joi.string().uri().required().messages({
  "string.uri": "Submission file URL must be a valid URL",
  "any.required": "Submission file is required",
});

export const submittedAt = dateField.messages({
  "date.base": "Submission date must be a valid date",
});

export const marksObtained = positiveNumber.allow(null).messages({
  "number.base": "Marks obtained must be a number",
});

export const teacherFeedback = Joi.string().trim().max(1000).allow("").messages({
  "string.base": "Teacher feedback must be a string",
  "string.max": "Teacher feedback must not exceed 1000 characters",
});

export const status = Joi.string()
  .valid("SUBMITTED", "GRADED", "LATE", "RESUBMISSION_REQUESTED")
  .messages({
    "any.only":
      "Status must be SUBMITTED, GRADED, LATE, or RESUBMISSION_REQUESTED",
  });
