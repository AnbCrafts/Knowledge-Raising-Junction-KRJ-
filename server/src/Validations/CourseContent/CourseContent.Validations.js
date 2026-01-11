import Joi from "joi";

/* =========================
   CORE REFERENCES
========================== */
export const course = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid course ID",
    "any.required": "Course ID is required"
  });

/* =========================
   CONTENT INFO
========================== */
export const title = Joi.string()
  .trim()
  .min(3)
  .max(200)
  .required()
  .messages({
    "string.empty": "Content title is required",
    "string.min": "Content title must be at least 3 characters",
    "string.max": "Content title must not exceed 200 characters"
  });

export const description = Joi.string()
  .max(1000)
  .optional()
  .messages({
    "string.max": "Description cannot exceed 1000 characters"
  });

export const type = Joi.string()
  .valid("VIDEO", "PDF", "QUIZ", "ASSIGNMENT")
  .required()
  .messages({
    "any.only":
      "Content type must be one of VIDEO, PDF, QUIZ, or ASSIGNMENT",
    "any.required": "Content type is required"
  });

export const order = Joi.number()
  .integer()
  .min(1)
  .required()
  .messages({
    "number.base": "Order must be a number",
    "number.integer": "Order must be an integer",
    "number.min": "Order must be greater than or equal to 1",
    "any.required": "Order is required"
  });

/* =========================
   CONTENT STORAGE
========================== */
export const contentUrl = Joi.string()
  .uri()
  .required()
  .messages({
    "string.uri": "Content URL must be a valid URL",
    "any.required": "Content URL is required"
  });

export const durationInMinutes = Joi.number()
  .positive()
  .optional()
  .messages({
    "number.positive": "Duration must be a positive number"
  });

export const fileSizeMB = Joi.number()
  .positive()
  .optional()
  .messages({
    "number.positive": "File size must be a positive number"
  });

/* =========================
   ACCESS CONTROL
========================== */
export const isFreePreview = Joi.boolean()
  .optional()
  .messages({
    "boolean.base": "isFreePreview must be true or false"
  });

export const isActive = Joi.boolean()
  .optional()
  .messages({
    "boolean.base": "isActive must be true or false"
  });

/* =========================
   QUIZ / ASSIGNMENT META
========================== */
export const meta = Joi.object()
  .unknown(true)
  .optional()
  .messages({
    "object.base": "Meta must be a valid object"
  });

/* =========================
   AUDIT
========================== */
export const createdBy = Joi.string()
  .valid("SUPER_ADMIN")
  .optional()
  .messages({
    "any.only": "Invalid creator value"
  });
