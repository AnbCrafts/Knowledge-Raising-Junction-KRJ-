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

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Value cannot be negative",
});

/* ------------------ HOLDER CONTEXT ------------------ */

export const holderType = Joi.string()
  .valid("STUDENT", "EMPLOYEE")
  .required()
  .messages({
    "any.only": "Holder type must be STUDENT or EMPLOYEE",
    "any.required": "Holder type is required",
  });

export const holderId = objectId.required().messages({
  "any.required": "Holder ID is required",
});

/* ------------------ CORE ID CARD DATA ------------------ */

export const idNumber = Joi.string().trim().min(3).max(50).required().messages({
  "string.base": "ID number must be a string",
  "string.empty": "ID number is required",
  "string.min": "ID number must be at least 3 characters long",
  "string.max": "ID number must not exceed 50 characters",
});

export const branch = objectId.required().messages({
  "any.required": "Branch reference is required",
});

export const photo = Joi.string().uri().required().messages({
  "string.uri": "Photo must be a valid URL",
  "any.required": "Photo is required",
});

export const qrCode = Joi.string().allow("").messages({
  "string.base": "QR code must be a string",
});

/* ------------------ DATES ------------------ */

export const issueDate = dateField.messages({
  "date.base": "Issue date must be a valid date",
});

export const expiryDate = dateField.messages({
  "date.base": "Expiry date must be a valid date",
});

/* ------------------ STATUS & META ------------------ */

export const status = Joi.string()
  .valid("ACTIVE", "EXPIRED", "SUSPENDED", "REISSUED")
  .messages({
    "any.only":
      "Status must be ACTIVE, EXPIRED, SUSPENDED, or REISSUED",
  });

export const printedCount = positiveNumber.messages({
  "number.base": "Printed count must be a number",
});

export const remarks = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});
