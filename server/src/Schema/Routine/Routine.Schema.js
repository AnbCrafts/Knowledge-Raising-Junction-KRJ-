import mongoose from "mongoose";

const routineSlotSchema = new mongoose.Schema(
  {
    // 1. ARRAY OF BRANCHES (Joint sessions across locations?)
    branches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    }],

    // 2. ARRAY OF BATCHES (Combined classes)
    batches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
    }],

    // 3. ARRAY OF TEACHERS (Main teacher + Assistant?)
    teachers: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    }],

    // 4. SUBJECT (Usually one subject per slot)
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },

    // 5. TIME & DAY
    day: {
      type: String,
      enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
      required: true,
    },
    startTime: { type: String, required: true }, // "10:00"
    endTime: { type: String, required: true },   // "11:00"

    // Optional: Specific Date (If this is a special one-time class, not weekly)
    specificDate: {
      type: Date, // e.g., 2025-12-25
      default: null
    },

    // 6. META INFORMATION
    classType: {
      type: String,
      enum: ["REGULAR", "EXTRA", "LAB", "SEMINAR", "EXAM"],
      default: "REGULAR"
    },
    roomNumber: { type: String },
    meetingLink: { type: String }, // For online/hybrid classes
    topic: { type: String },       // e.g., "Thermodynamics Intro"
    
    isCancelled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// INDEXES FOR SEARCH PERFORMANCE

// 1. Find all classes for a specific batch (e.g., Student Dashboard)
routineSlotSchema.index({ batches: 1 });

// 2. Find all classes for a specific teacher (e.g., Teacher Dashboard)
routineSlotSchema.index({ teachers: 1 });

// 3. Find schedule by Day
routineSlotSchema.index({ day: 1 });

export const RoutineSlot = mongoose.model("RoutineSlot", routineSlotSchema);