import Joi from "joi";

/* =========================
   BASIC USER INFO
========================== */
export const name = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .required()
  .messages({
    "string.base": "Name must be a string",
    "string.empty": "Name is required",
    "string.min": "Name must be at least 2 characters",
    "string.max": "Name must be at most 100 characters"
  });

export const email = Joi.string()
  .email()
  .lowercase()
  .required()
  .messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required"
  });

export const phone = Joi.string()
  .pattern(/^[0-9]{10}$/)
  .optional()
  .messages({
    "string.pattern.base": "Phone number must be 10 digits"
  });

export const password = Joi.string()
  .min(8)
  .max(32)
  .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
  .required()
  .messages({
    "string.pattern.base":
      "Password must include uppercase, lowercase, number and special character",
    "string.min": "Password must be at least 8 characters"
  });

/* =========================
   ROLE & LINKING
========================== */
export const role = Joi.string()
  .valid("ECOM_USER")
  .optional();

export const isManagementLinked = Joi.boolean().optional();

export const managementRef = Joi.object({
  type: Joi.string()
    .valid("STUDENT", "EMPLOYEE")
    .required(),
  refId: Joi.string()
    .hex()
    .length(24)
    .required()
}).optional();

export const managementCode = Joi.string()
  .trim()
  .min(5)
  .max(50)
  .optional();

/* =========================
   VERIFICATION & STATUS
========================== */
export const isEmailVerified = Joi.boolean().optional();

export const isPhoneVerified = Joi.boolean().optional();

export const isActive = Joi.boolean().optional();

export const lastLoginAt = Joi.date().optional();

/* =========================
   DEVICE TRACKING
========================== */
export const device = Joi.object({
  deviceId: Joi.string().required(),
  deviceType: Joi.string().optional(),
  browser: Joi.string().optional(),
  os: Joi.string().optional(),
  ipAddress: Joi.string().ip().optional(),
  lastUsedAt: Joi.date().optional()
});

export const devices = Joi.array()
  .items(device)
  .optional();

/* =========================
   SECURITY
========================== */
export const loginAttempts = Joi.number()
  .integer()
  .min(0)
  .optional();

export const lockUntil = Joi.date().optional();

/* =========================
   AUDIT
========================== */
export const createdBy = Joi.string()
  .valid("SELF", "ADMIN", "SYSTEM")
  .optional();
