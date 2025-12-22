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

/* ------------------ CORE REFERENCES ------------------ */

export const userId = objectId.required().messages({
  "any.required": "User ID is required for admin profile",
});

export const employeeId = objectId.allow(null).messages({
  "any.only": "Invalid employee reference",
});

/* ------------------ ROLE & PERMISSIONS ------------------ */

export const role = Joi.string()
  .valid("super_admin", "manager", "editor", "viewer")
  .messages({
    "any.only":
      "Role must be super_admin, manager, editor, or viewer",
  });

export const permission = Joi.string().valid(
  "manage_users",
  "manage_teachers",
  "manage_students",
  "manage_courses",
  "manage_payments",
  "manage_branches",
  "manage_admins",
  "manage_schedule",
  "manage_content",
  "view_reports",
  "system_settings"
);

export const permissions = Joi.array().items(permission).messages({
  "array.base": "Permissions must be an array of valid permission strings",
});

/* ------------------ BRANCH ACCESS ------------------ */

export const branches = Joi.array().items(objectId).messages({
  "array.base": "Branches must be an array of branch IDs",
});

/* ------------------ HIERARCHY ------------------ */

export const managedBy = objectId.allow(null).messages({
  "any.only": "Invalid managedBy admin reference",
});

/* ------------------ NOTIFICATIONS ------------------ */

export const notifications = Joi.array().items(objectId).messages({
  "array.base": "Notifications must be an array of notification IDs",
});

/* ------------------ SETTINGS ------------------ */

export const settings = Joi.object({
  theme: Joi.string().valid("light", "dark").messages({
    "any.only": "Theme must be light or dark",
  }),
  emailNotifications: booleanField,
  dashboardLayout: Joi.object().unknown(true).messages({
    "object.base": "Dashboard layout must be an object",
  }),
}).messages({
  "object.base": "Settings must be an object",
});

/* ------------------ LOGS ------------------ */

export const logEntry = Joi.object({
  action: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Log action is required",
    "string.min": "Log action must be at least 2 characters long",
    "string.max": "Log action must not exceed 100 characters",
  }),
  target: Joi.string().trim().max(100).messages({
    "string.base": "Log target must be a string",
    "string.max": "Log target must not exceed 100 characters",
  }),
  timestamp: dateField,
  details: Joi.object().unknown(true).messages({
    "object.base": "Log details must be an object",
  }),
});

export const logs = Joi.array().items(logEntry).messages({
  "array.base": "Logs must be an array of log entries",
});

/* ------------------ STATUS & META ------------------ */

export const isActive = booleanField;

export const lastLogin = dateField.messages({
  "date.base": "Last login must be a valid date",
});

export const createdBy = objectId.messages({
  "any.only": "Invalid createdBy user reference",
});

export const updatedBy = objectId.messages({
  "any.only": "Invalid updatedBy user reference",
});

export const deletedAt = dateField.allow(null).messages({
  "date.base": "DeletedAt must be a valid date",
});
