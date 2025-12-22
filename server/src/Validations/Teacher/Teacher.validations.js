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

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});

/* ------------------ CORE REFERENCES ------------------ */

export const userId = objectId.required().messages({
  "any.required": "User ID is required for teacher profile",
});

export const employeeId = objectId.required().messages({
  "any.required": "Employee ID is required for teacher profile",
});

/* ------------------ PROFESSIONAL STATS ------------------ */

export const experience = Joi.number().min(0).max(60).messages({
  "number.base": "Experience must be a number",
  "number.min": "Experience cannot be negative",
  "number.max": "Experience cannot exceed 60 years",
});

export const totalSubjects = positiveNumber.messages({
  "number.base": "Total subjects must be a number",
});

export const totalStudents = positiveNumber.messages({
  "number.base": "Total students must be a number",
});

/* ------------------ RATINGS ------------------ */

export const ratingValue = Joi.number().min(1).max(5).messages({
  "number.base": "Rating must be a number",
  "number.min": "Rating must be at least 1",
  "number.max": "Rating cannot exceed 5",
});

export const ratingReview = Joi.string().max(500).allow("").messages({
  "string.base": "Review must be a string",
  "string.max": "Review cannot exceed 500 characters",
});

export const ratingDate = Joi.date().messages({
  "date.base": "Rating date must be a valid date",
});

export const ratingObject = Joi.object({
  studentId: objectId.required().messages({
    "any.required": "Student ID is required for rating",
  }),
  rating: ratingValue.required(),
  review: ratingReview.optional(),
  date: ratingDate.optional(),
});

export const ratings = Joi.array().items(ratingObject).messages({
  "array.base": "Ratings must be an array",
});

/* ------------------ DOCUMENTS & STATUS ------------------ */

export const documents = Joi.string().uri().allow("").messages({
  "string.base": "Documents must be a string",
  "string.uri": "Documents must be a valid URL",
});

export const availableToday = booleanField;
export const profileComplete = booleanField;
export const documentsUploaded = booleanField;

/* ------------------ RELATIONSHIPS ------------------ */

export const batches = Joi.array().items(objectId).messages({
  "array.base": "Batches must be an array of batch IDs",
});

export const routines = Joi.array().items(objectId).messages({
  "array.base": "Routines must be an array of routine IDs",
});

export const students = Joi.array().items(objectId).messages({
  "array.base": "Students must be an array of student IDs",
});

export const attendanceRecords = Joi.array().items(objectId).messages({
  "array.base": "Attendance records must be an array of IDs",
});
