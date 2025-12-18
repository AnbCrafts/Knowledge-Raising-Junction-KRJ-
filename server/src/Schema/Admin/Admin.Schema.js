import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Link to Employee record for payroll/HR purposes
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["super_admin", "manager", "editor", "viewer"],
      default: "manager",
    },
    permissions: [
      {
        type: String,
        enum: [
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
          "system_settings",
        ],
      },
    ],
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
      },
    ],
    // Hierarchy: Who manages this admin?
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
    // Admin-specific preferences
    settings: {
      theme: { type: String, default: "light" },
      emailNotifications: { type: Boolean, default: true },
      dashboardLayout: { type: mongoose.Schema.Types.Mixed, default: {} },
    },
    logs: [
      {
        action: { type: String, required: true },
        target: { type: String }, // e.g., "User: 12345"
        timestamp: { type: Date, default: Date.now },
        details: { type: mongoose.Schema.Types.Mixed },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },
    // Audit fields
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    deletedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
adminSchema.index({ userId: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ employeeId: 1 });
adminSchema.index({ branches: 1 });

export const Admin = mongoose.model("Admin", adminSchema);
