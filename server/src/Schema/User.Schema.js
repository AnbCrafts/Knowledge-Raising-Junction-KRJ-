import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      sparse: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    profileImage: {
      type: String,
    },

    role: {
      type: String,
      enum: ["STUDENT", "TEACHER", "ADMIN"],
      required: true,
    },

    permissions: [{ type: String }],

    teacherProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    studentProfile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },

    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },

    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    lastPasswordChange: { type: Date },

    resetToken: { type: String },
    resetTokenExpiry: { type: Date },

    otpCode: { type: String },
    otpExpiry: { type: Date },

    twoFactorEnabled: { type: Boolean, default: false },
    twoFactorSecret: { type: String, select: false },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model("User", userSchema);
