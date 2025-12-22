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

/* ------------------ ATTENDEE CONTEXT ------------------ */

export const attendeeType = Joi.string()
  .valid("STUDENT", "TEACHER", "EMPLOYEE")
  .required()
  .messages({
    "any.only": "Attendee type must be STUDENT, TEACHER, or EMPLOYEE",
    "any.required": "Attendee type is required",
  });

export const attendeeId = objectId.required().messages({
  "any.required": "Attendee ID is required",
});

/* ------------------ CONTEXT ------------------ */

export const branch = objectId.required().messages({
  "any.required": "Branch reference is required",
});

export const batch = objectId.allow(null).messages({
  "any.only": "Invalid batch reference",
});

export const subject = objectId.allow(null).messages({
  "any.only": "Invalid subject reference",
});

/* ------------------ ATTENDANCE INFO ------------------ */

export const date = dateField.required().messages({
  "any.required": "Attendance date is required",
});

export const status = Joi.string()
  .valid("PRESENT", "ABSENT", "LATE", "HALF_DAY", "ON_LEAVE")
  .required()
  .messages({
    "any.only":
      "Status must be PRESENT, ABSENT, LATE, HALF_DAY, or ON_LEAVE",
    "any.required": "Attendance status is required",
  });

export const checkInTime = dateField.allow(null).messages({
  "date.base": "Check-in time must be a valid date",
});

export const checkOutTime = dateField.allow(null).messages({
  "date.base": "Check-out time must be a valid date",
});

/* ------------------ META ------------------ */

export const markedBy = objectId.required().messages({
  "any.required": "MarkedBy user reference is required",
});

export const remarks = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});
