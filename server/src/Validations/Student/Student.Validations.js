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

/* ------------------ CORE REFERENCES ------------------ */

export const userId = objectId.required().messages({
  "any.required": "User ID is required for student profile",
});

export const branch = objectId.messages({
  "any.only": "Invalid branch reference",
});

export const batch = objectId.messages({
  "any.only": "Invalid batch reference",
});

/* ------------------ BASIC INFO ------------------ */

export const fatherName = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Father name must be a string",
  "string.min": "Father name must be at least 2 characters long",
  "string.max": "Father name must not exceed 100 characters",
});

export const motherName = Joi.string().trim().min(2).max(100).messages({
  "string.base": "Mother name must be a string",
  "string.min": "Mother name must be at least 2 characters long",
  "string.max": "Mother name must not exceed 100 characters",
});

export const bloodGroup = Joi.string()
  .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
  .messages({
    "any.only": "Blood group must be a valid type (A+, A-, B+, etc.)",
  });

export const gender = Joi.string()
  .valid("Male", "Female", "Other")
  .messages({
    "any.only": "Gender must be Male, Female, or Other",
  });

export const dob = dateField.messages({
  "date.base": "Date of birth must be a valid date",
});

export const address = Joi.string().trim().max(500).messages({
  "string.base": "Address must be a string",
  "string.max": "Address must not exceed 500 characters",
});

/* ------------------ CONTACT ------------------ */

export const whatsapp = Joi.string().pattern(/^[0-9]{10,15}$/).messages({
  "string.pattern.base": "WhatsApp number must contain 10–15 digits",
});

export const parentMobile = Joi.string().pattern(/^[0-9]{10,15}$/).messages({
  "string.pattern.base": "Parent mobile number must contain 10–15 digits",
});

export const contact = Joi.object({
  whatsapp,
  parentMobile,
}).messages({
  "object.base": "Contact must be an object",
});

/* ------------------ ACADEMIC ------------------ */

export const academicProfile = objectId.messages({
  "any.only": "Invalid academic profile reference",
});

/* ------------------ TEACHER RELATIONSHIP ------------------ */

export const assignedTeacher = Joi.array().items(objectId).messages({
  "array.base": "Assigned teacher must be an array of teacher IDs",
});

/* ------------------ DATES ------------------ */

export const joiningDate = dateField.messages({
  "date.base": "Joining date must be a valid date",
});

export const leavingDate = dateField.messages({
  "date.base": "Leaving date must be a valid date",
});

/* ------------------ REFERENCES ------------------ */

export const attendanceRef = Joi.array().items(objectId).messages({
  "array.base": "Attendance reference must be an array of IDs",
});

export const leaveRef = Joi.array().items(objectId).messages({
  "array.base": "Leave reference must be an array of IDs",
});

export const testRecords = Joi.array().items(objectId).messages({
  "array.base": "Test records must be an array of IDs",
});

export const feeAccount = Joi.array().items(objectId).messages({
  "array.base": "Fee account must be an array of payment IDs",
});

export const idCard = objectId.messages({
  "any.only": "Invalid ID card reference",
});

export const onlineCourses = Joi.array().items(objectId).messages({
  "array.base": "Online courses must be an array of IDs",
});

/* ------------------ STATUS ------------------ */

export const status = Joi.string()
  .valid("ACTIVE", "LEFT", "INACTIVE")
  .messages({
    "any.only": "Status must be ACTIVE, LEFT, or INACTIVE",
  });
