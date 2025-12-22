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

export const positiveNumber = Joi.number().min(0).messages({
  "number.base": "Value must be a number",
  "number.min": "Amount cannot be negative",
});

/* ------------------ PAYEE CONTEXT ------------------ */

export const paidByType = Joi.string()
  .valid("STUDENT", "EMPLOYEE")
  .required()
  .messages({
    "any.only": "PaidByType must be STUDENT or EMPLOYEE",
    "any.required": "PaidByType is required",
  });

export const paidById = objectId.required().messages({
  "any.required": "PaidById is required",
});

/* ------------------ OPTIONAL REFERENCES ------------------ */

export const student = objectId.allow(null).messages({
  "any.only": "Invalid student reference",
});

export const employee = objectId.allow(null).messages({
  "any.only": "Invalid employee reference",
});

/* ------------------ CONTEXT ------------------ */

export const branch = objectId.required().messages({
  "any.required": "Branch reference is required",
});

export const batch = objectId.allow(null).messages({
  "any.only": "Invalid batch reference",
});

/* ------------------ PAYMENT DETAILS ------------------ */

export const amount = positiveNumber.required().messages({
  "any.required": "Payment amount is required",
});

export const currency = Joi.string().trim().length(3).uppercase().messages({
  "string.length": "Currency must be a 3-letter ISO code (e.g., INR)",
});

export const paymentType = Joi.string()
  .valid("FEES", "SALARY", "INCENTIVE", "REFUND", "PENALTY", "PURCHASE")
  .required()
  .messages({
    "any.only":
      "Payment type must be FEES, SALARY, INCENTIVE, REFUND, PENALTY, or PURCHASE",
    "any.required": "Payment type is required",
  });

export const paymentMethod = Joi.string()
  .valid("CASH", "UPI", "CARD", "NET_BANKING", "CHEQUE")
  .required()
  .messages({
    "any.only":
      "Payment method must be CASH, UPI, CARD, NET_BANKING, or CHEQUE",
    "any.required": "Payment method is required",
  });

export const transactionId = Joi.string().trim().allow("").messages({
  "string.base": "Transaction ID must be a string",
});

/* ------------------ STATUS & DATE ------------------ */

export const status = Joi.string()
  .valid("PENDING", "SUCCESS", "FAILED")
  .messages({
    "any.only": "Status must be PENDING, SUCCESS, or FAILED",
  });

export const paymentDate = dateField.messages({
  "date.base": "Payment date must be a valid date",
});

/* ------------------ PERIOD (MONTH/YEAR) ------------------ */

export const period = Joi.object({
  month: Joi.number().integer().min(1).max(12).messages({
    "number.min": "Month must be between 1 and 12",
    "number.max": "Month must be between 1 and 12",
  }),
  year: Joi.number().integer().min(2000).max(2100).messages({
    "number.min": "Year must be 2000 or later",
    "number.max": "Year must not exceed 2100",
  }),
}).messages({
  "object.base": "Period must be an object containing month and year",
});

/* ------------------ META ------------------ */

export const remarks = Joi.string().trim().max(500).allow("").messages({
  "string.base": "Remarks must be a string",
  "string.max": "Remarks must not exceed 500 characters",
});

export const createdBy = objectId.messages({
  "any.only": "Invalid createdBy user reference",
});
