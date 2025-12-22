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

/* ------------------ CORE RELATIONSHIPS ------------------ */

export const branches = Joi.array().items(objectId).min(1).messages({
  "array.base": "Branches must be an array of branch IDs",
  "array.min": "At least one branch is required",
});

export const batches = Joi.array().items(objectId).min(1).messages({
  "array.base": "Batches must be an array of batch IDs",
  "array.min": "At least one batch is required",
});

export const teachers = Joi.array().items(objectId).min(1).messages({
  "array.base": "Teachers must be an array of teacher IDs",
  "array.min": "At least one teacher is required",
});

export const subject = objectId.required().messages({
  "any.required": "Subject is required for routine slot",
});

/* ------------------ DAY & TIME ------------------ */

export const day = Joi.string()
  .valid(
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY"
  )
  .messages({
    "any.only":
      "Day must be MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, or SUNDAY",
  });

export const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;

export const startTime = Joi.string().pattern(timePattern).messages({
  "string.base": "Start time must be a string",
  "string.pattern.base": "Start time must be in HH:mm format",
});

export const endTime = Joi.string().pattern(timePattern).messages({
  "string.base": "End time must be a string",
  "string.pattern.base": "End time must be in HH:mm format",
});

/* ------------------ OPTIONAL DATE ------------------ */

export const specificDate = dateField.allow(null).messages({
  "date.base": "Specific date must be a valid date",
});

/* ------------------ META INFORMATION ------------------ */

export const classType = Joi.string()
  .valid("REGULAR", "EXTRA", "LAB", "SEMINAR", "EXAM")
  .messages({
    "any.only":
      "Class type must be REGULAR, EXTRA, LAB, SEMINAR, or EXAM",
  });

export const roomNumber = Joi.string().trim().max(20).messages({
  "string.base": "Room number must be a string",
  "string.max": "Room number must not exceed 20 characters",
});

export const meetingLink = Joi.string().uri().messages({
  "string.uri": "Meeting link must be a valid URL",
});

export const topic = Joi.string().trim().max(200).messages({
  "string.base": "Topic must be a string",
  "string.max": "Topic must not exceed 200 characters",
});

export const isCancelled = booleanField;
