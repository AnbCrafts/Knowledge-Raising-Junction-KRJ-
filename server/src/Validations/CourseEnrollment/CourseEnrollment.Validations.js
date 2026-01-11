import Joi from "joi";

/* =========================
   CORE REFERENCES
========================== */
export const user = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid user ID",
    "any.required": "User ID is required"
  });

export const course = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid course ID",
    "any.required": "Course ID is required"
  });

export const payment = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid payment ID",
    "any.required": "Payment reference is required"
  });

/* =========================
   ACCESS CONTROL
========================== */
export const accessType = Joi.string()
  .valid("LIFETIME", "TIME_BOUND")
  .optional()
  .messages({
    "any.only": "Access type must be LIFETIME or TIME_BOUND"
  });

export const accessStartsAt = Joi.date()
  .optional()
  .messages({
    "date.base": "Access start date must be a valid date"
  });

export const accessExpiresAt = Joi.date()
  .greater(Joi.ref("accessStartsAt"))
  .optional()
  .messages({
    "date.greater":
      "Access expiry must be later than access start date"
  });

export const isActive = Joi.boolean()
  .optional()
  .messages({
    "boolean.base": "isActive must be true or false"
  });

/* =========================
   PROGRESS TRACKING
========================== */
export const progress = Joi.object({
  percentage: Joi.number()
    .min(0)
    .max(100)
    .optional()
    .messages({
      "number.min": "Progress percentage cannot be less than 0",
      "number.max": "Progress percentage cannot exceed 100"
    }),

  completedContent: Joi.array()
    .items(
      Joi.string()
        .hex()
        .length(24)
        .messages({
          "string.length": "Invalid content ID"
        })
    )
    .optional(),

  lastAccessedAt: Joi.date()
    .optional()
    .messages({
      "date.base": "Last accessed time must be a valid date"
    })
}).optional();

/* =========================
   COMPLETION / CERTIFICATE
========================== */
export const isCompleted = Joi.boolean()
  .optional()
  .messages({
    "boolean.base": "isCompleted must be true or false"
  });

export const completedAt = Joi.date()
  .optional()
  .messages({
    "date.base": "Completion date must be a valid date"
  });

export const certificateUrl = Joi.string()
  .uri()
  .optional()
  .messages({
    "string.uri": "Certificate URL must be a valid URL"
  });

/* =========================
   AUDIT
========================== */
export const enrolledAt = Joi.date()
  .optional()
  .messages({
    "date.base": "Enrollment date must be a valid date"
  });
