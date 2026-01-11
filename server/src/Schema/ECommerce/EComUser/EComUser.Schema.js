import mongoose from "mongoose";

const EComUserSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC USER INFO
    ========================== */
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      index: true
    },

    phone: {
      type: String,
      required: false,
      index: true
    },

    password: {
      type: String,
      required: true,
      select: false
    },

    /* =========================
       USER TYPE & LINKING
    ========================== */
    role: {
      type: String,
      enum: ["ECOM_USER"],
      default: "ECOM_USER"
    },

    isManagementLinked: {
      type: Boolean,
      default: false
    },

    managementRef: {
      type: {
        type: String,
        enum: ["STUDENT", "EMPLOYEE"]
      },
      refId: {
        type: mongoose.Schema.Types.ObjectId
      }
    },

    managementCode: {
      type: String,
      index: true
    },

    /* =========================
       VERIFICATION & STATUS
    ========================== */
    isEmailVerified: {
      type: Boolean,
      default: false
    },

    isPhoneVerified: {
      type: Boolean,
      default: false
    },

    isActive: {
      type: Boolean,
      default: true
    },

    lastLoginAt: {
      type: Date
    },

    /* =========================
       DEVICE TRACKING
    ========================== */
    devices: [
      {
        deviceId: String,
        deviceType: String,
        browser: String,
        os: String,
        ipAddress: String,
        lastUsedAt: Date
      }
    ],

    /* =========================
       SECURITY
    ========================== */
    loginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date
    },

    /* =========================
       AUDIT
    ========================== */
    createdBy: {
      type: String,
      default: "SELF"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES (ONLY ONCE)
========================== */
EComUserSchema.index({ email: 1 });
EComUserSchema.index({ phone: 1 });
EComUserSchema.index({ managementCode: 1 });

export default mongoose.model("EComUser", EComUserSchema);
