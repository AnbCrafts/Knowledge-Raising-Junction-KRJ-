import Joi from "joi";

/* =========================
   BASIC COURSE INFO
========================== */
export const title = Joi.string()
  .trim()
  .min(5)
  .max(200)
  .required()
  .messages({
    "string.base": "Course title must be a string",
    "string.empty": "Course title is required",
    "string.min": "Course title must be at least 5 characters",
    "string.max": "Course title must not exceed 200 characters"
  });

export const slug = Joi.string()
  .trim()
  .lowercase()
  .pattern(/^[a-z0-9-]+$/)
  .required()
  .messages({
    "string.empty": "Course slug is required",
    "string.pattern.base":
      "Slug can contain only lowercase letters, numbers, and hyphens"
  });

export const shortDescription = Joi.string()
  .max(500)
  .optional()
  .messages({
    "string.max": "Short description cannot exceed 500 characters"
  });

export const description = Joi.string()
  .min(20)
  .required()
  .messages({
    "string.empty": "Course description is required",
    "string.min": "Course description must be at least 20 characters"
  });

/* =========================
   CATEGORY & TAGGING
========================== */
export const category = Joi.string()
  .trim()
  .required()
  .messages({
    "string.empty": "Course category is required"
  });

export const subCategory = Joi.string()
  .trim()
  .optional();

export const tags = Joi.array()
  .items(Joi.string().trim())
  .optional()
  .messages({
    "array.base": "Tags must be an array of strings"
  });

export const level = Joi.string()
  .valid("BEGINNER", "INTERMEDIATE", "ADVANCED")
  .optional()
  .messages({
    "any.only": "Level must be BEGINNER, INTERMEDIATE, or ADVANCED"
  });

export const language = Joi.string()
  .trim()
  .optional();

/* =========================
   PRICING
========================== */
export const price = Joi.number()
  .positive()
  .required()
  .messages({
    "number.base": "Course price must be a number",
    "number.positive": "Course price must be greater than zero",
    "any.required": "Course price is required"
  });

export const discountPrice = Joi.number()
  .positive()
  .less(Joi.ref("price"))
  .optional()
  .messages({
    "number.less": "Discount price must be less than actual price"
  });

export const discountValidTill = Joi.date()
  .greater("now")
  .optional()
  .messages({
    "date.greater": "Discount validity date must be in the future"
  });

export const isFree = Joi.boolean()
  .optional();

/* =========================
   MEDIA
========================== */
export const thumbnailUrl = Joi.string()
  .uri()
  .required()
  .messages({
    "string.uri": "Thumbnail must be a valid URL",
    "string.empty": "Thumbnail is required"
  });

export const previewVideoUrl = Joi.string()
  .uri()
  .optional()
  .messages({
    "string.uri": "Preview video must be a valid URL"
  });

/* =========================
   COURSE METRICS
========================== */
export const totalDurationInHours = Joi.number()
  .positive()
  .optional()
  .messages({
    "number.positive": "Duration must be a positive number"
  });

export const totalLectures = Joi.number()
  .integer()
  .min(0)
  .optional()
  .messages({
    "number.base": "Total lectures must be a number"
  });

export const totalResources = Joi.number()
  .integer()
  .min(0)
  .optional();

/* =========================
   INSTRUCTOR INFO
========================== */
export const instructorName = Joi.string()
  .trim()
  .required()
  .messages({
    "string.empty": "Instructor name is required"
  });

export const instructorBio = Joi.string()
  .max(1000)
  .optional()
  .messages({
    "string.max": "Instructor bio cannot exceed 1000 characters"
  });

/* =========================
   PUBLISHING CONTROL
========================== */
export const status = Joi.string()
  .valid("DRAFT", "PUBLISHED", "ARCHIVED")
  .optional()
  .messages({
    "any.only": "Status must be DRAFT, PUBLISHED, or ARCHIVED"
  });

export const publishedAt = Joi.date()
  .optional();

export const isActive = Joi.boolean()
  .optional();

/* =========================
   ACCESS POLICY
========================== */
export const accessType = Joi.string()
  .valid("LIFETIME", "TIME_BOUND")
  .optional()
  .messages({
    "any.only": "Access type must be LIFETIME or TIME_BOUND"
  });

export const accessDurationInDays = Joi.number()
  .positive()
  .optional()
  .messages({
    "number.positive": "Access duration must be greater than zero"
  });

/* =========================
   SEO
========================== */
export const seo = Joi.object({
  metaTitle: Joi.string().max(60).optional(),
  metaDescription: Joi.string().max(160).optional(),
  keywords: Joi.array().items(Joi.string()).optional()
}).optional();

/* =========================
   ADMIN
========================== */
export const createdBy = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid admin ID"
  });
