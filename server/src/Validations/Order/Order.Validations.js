import Joi from "joi";

/* =========================
   REFERENCES
========================== */
export const user = Joi.string()
  .hex()
  .length(24)
  .required()
  .messages({
    "string.length": "Invalid user ID"
  });

export const courseItem = Joi.object({
  courseId: Joi.string()
    .hex()
    .length(24)
    .required(),
  priceAtPurchase: Joi.number()
    .positive()
    .required()
});

export const courses = Joi.array()
  .items(courseItem)
  .min(1)
  .required()
  .messages({
    "array.min": "At least one course is required"
  });

/* =========================
   PAYMENT DETAILS
========================== */
export const totalAmount = Joi.number()
  .positive()
  .required();

export const currency = Joi.string()
  .length(3)
  .default("INR");

export const paymentGateway = Joi.string()
  .valid("RAZORPAY", "STRIPE", "PAYU")
  .required();

export const paymentStatus = Joi.string()
  .valid("PENDING", "SUCCESS", "FAILED", "REFUNDED")
  .optional();

/* =========================
   GATEWAY IDS
========================== */
export const orderId = Joi.string().optional();

export const paymentId = Joi.string().optional();

export const transactionId = Joi.string().optional();

/* =========================
   COUPON / DISCOUNT
========================== */
export const couponCode = Joi.string()
  .trim()
  .max(30)
  .optional();

export const discountAmount = Joi.number()
  .min(0)
  .optional();

/* =========================
   FAILURE / REFUND
========================== */
export const failureReason = Joi.string()
  .max(300)
  .optional();

export const refundId = Joi.string().optional();

export const refundedAt = Joi.date().optional();

/* =========================
   SECURITY / AUDIT
========================== */
export const ipAddress = Joi.string()
  .ip()
  .optional();

export const userAgent = Joi.string()
  .optional();

export const gatewayResponse = Joi.object()
  .unknown(true)
  .optional();
