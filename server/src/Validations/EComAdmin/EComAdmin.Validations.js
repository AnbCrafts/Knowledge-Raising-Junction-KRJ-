import Joi from "joi";

/* =========================
   ADMIN IDENTITY
========================== */
export const name = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .required()
  .messages({
    "string.empty": "Admin name is required",
    "string.min": "Admin name must be at least 2 characters",
    "string.max": "Admin name must not exceed 100 characters"
  });

export const email = Joi.string()
  .email()
  .lowercase()
  .optional()
  .messages({
    "string.email": "Invalid admin email format"
  });

/* =========================
   AUTHENTICATION
========================== */
export const password = Joi.string()
  .min(8)
  .max(32)
  .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/)
  .optional()
  .messages({
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base":
      "Password must include uppercase, lowercase, number and special character"
  });

export const accessKey = Joi.string()
  .min(20)
  .required()
  .messages({
    "string.empty": "Access key is required",
    "string.min": "Invalid access key"
  });

export const authMode = Joi.string()
  .valid("PASSWORD", "ACCESS_KEY")
  .optional()
  .messages({
    "any.only": "Auth mode must be PASSWORD or ACCESS_KEY"
  });

/* =========================
   ROLE & PERMISSIONS
========================== */
export const role = Joi.string()
  .valid("SUPER_ADMIN", "CONTENT_ADMIN", "FINANCE_ADMIN")
  .optional()
  .messages({
    "any.only":
      "Role must be SUPER_ADMIN, CONTENT_ADMIN, or FINANCE_ADMIN"
  });

export const permissions = Joi.array()
  .items(Joi.string())
  .optional()
  .messages({
    "array.base": "Permissions must be an array of strings"
  });

/* =========================
   DEVICE RESTRICTION
========================== */
export const device = Joi.object({
  deviceId: Joi.string().required(),
  deviceName: Joi.string().optional(),
  browser: Joi.string().optional(),
  os: Joi.string().optional(),
  ipAddress: Joi.string().ip().optional(),
  addedAt: Joi.date().optional()
});

export const allowedDevices = Joi.array()
  .items(device)
  .optional()
  .messages({
    "array.base": "Allowed devices must be an array"
  });

export const lastLoginAt = Joi.date().optional();

/* =========================
   SECURITY FLAGS
========================== */
export const isActive = Joi.boolean()
  .optional()
  .messages({
    "boolean.base": "isActive must be true or false"
  });

export const accessKeyExpiresAt = Joi.date()
  .greater("now")
  .optional()
  .messages({
    "date.greater": "Access key expiry must be a future date"
  });

/* =========================
   AUDIT
========================== */
export const createdBy = Joi.string()
  .valid("SYSTEM", "SUPER_ADMIN")
  .optional()
  .messages({
    "any.only": "Invalid createdBy value"
  });
