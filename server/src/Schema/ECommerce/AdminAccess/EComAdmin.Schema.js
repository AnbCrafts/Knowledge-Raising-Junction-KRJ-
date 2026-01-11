import mongoose from "mongoose";

const EComAdminSchema = new mongoose.Schema(
  {
    /* =========================
       ADMIN IDENTITY
    ========================== */
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      lowercase: true,
      unique: true,
      sparse: true
    },

    /* =========================
       AUTHENTICATION
    ========================== */
    password: {
      type: String,
      select: false
    },

    accessKeyHash: {
      type: String,
      select: false
    },

    authMode: {
      type: String,
      enum: ["PASSWORD", "ACCESS_KEY"],
      default: "ACCESS_KEY"
    },

    /* =========================
       ROLE & PERMISSIONS
    ========================== */
    role: {
      type: String,
      enum: ["SUPER_ADMIN", "CONTENT_ADMIN", "FINANCE_ADMIN"],
      default: "SUPER_ADMIN"
    },

    permissions: [
      {
        type: String
        // e.g. CREATE_COURSE, PUBLISH_COURSE, REFUND_PAYMENT
      }
    ],

    /* =========================
       DEVICE RESTRICTION
    ========================== */
    allowedDevices: [
      {
        deviceId: String,
        deviceName: String,
        browser: String,
        os: String,
        ipAddress: String,
        addedAt: Date
      }
    ],

    lastLoginAt: {
      type: Date
    },

    /* =========================
       SECURITY FLAGS
    ========================== */
    isActive: {
      type: Boolean,
      default: true
    },

    accessKeyExpiresAt: {
      type: Date
    },

    /* =========================
       AUDIT
    ========================== */
    createdBy: {
      type: String,
      default: "SYSTEM"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
========================== */
EComAdminSchema.index({ email: 1 });

export default mongoose.model("EComAdmin", EComAdminSchema);
