import mongoose from "mongoose";

const CoursePaymentSchema = new mongoose.Schema(
  {
    /* =========================
       REFERENCES
    ========================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EComUser",
      required: true,
      index: true
    },

    courses: [
      {
        courseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
          required: true
        },
        priceAtPurchase: {
          type: Number,
          required: true
        }
      }
    ],

    /* =========================
       PAYMENT DETAILS
    ========================== */
    totalAmount: {
      type: Number,
      required: true
    },

    currency: {
      type: String,
      default: "INR"
    },

    paymentGateway: {
      type: String,
      enum: ["RAZORPAY", "STRIPE", "PAYU"],
      required: true
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED", "REFUNDED"],
      default: "PENDING",
      index: true
    },

    /* =========================
       GATEWAY IDS
    ========================== */
    orderId: {
      type: String,
      index: true
    },

    paymentId: {
      type: String,
      index: true
    },

    transactionId: {
      type: String,
      index: true
    },

    /* =========================
       COUPON / DISCOUNT
    ========================== */
    couponCode: {
      type: String
    },

    discountAmount: {
      type: Number,
      default: 0
    },

    /* =========================
       FAILURE / REFUND
    ========================== */
    failureReason: {
      type: String
    },

    refundId: {
      type: String
    },

    refundedAt: {
      type: Date
    },

    /* =========================
       SECURITY & AUDIT
    ========================== */
    ipAddress: {
      type: String
    },

    userAgent: {
      type: String
    },

    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
========================== */
CoursePaymentSchema.index({ user: 1, paymentStatus: 1 });
CoursePaymentSchema.index({ orderId: 1 });
CoursePaymentSchema.index({ paymentId: 1 });

export default mongoose.model("CoursePayment", CoursePaymentSchema);
