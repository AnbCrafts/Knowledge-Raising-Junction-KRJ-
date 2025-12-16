import mongoose from "mongoose";


const batchSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
    },

    // Schedule
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },

    // Capacities
    studentCapacity: { type: Number, default: 60 },
    currentStudentCount: { type: Number, default: 0, min: 0 },

    teacherCapacity: { type: Number, default: 10 },
    currentTeacherCount: { type: Number, default: 0, min: 0 },

    isActive: {
      type: Boolean,
      default: true,
    },

    // --- FIXED REFS BELOW ---

    // 1. Subjects Array
    subjects: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "BatchSubject", // FIXED: Must match the Model name exported below
      default: null,
    }],

    // 2. Routine Array
    // CHANGED: Made this an Array []. A batch cannot have just ONE routine slot.
    routine: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoutineSlot", // FIXED
    }],

    // 3. Assignments (Junction Table Links)
    assignments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "SlotBatchAssignment" // FIXED
    }]
  },
  { timestamps: true }
);

// Virtuals
batchSchema.virtual("remainingStudentCapacity").get(function () {
  return this.studentCapacity - this.currentStudentCount;
});

batchSchema.virtual("remainingTeacherCapacity").get(function () {
  return this.teacherCapacity - this.currentTeacherCount;
});

batchSchema.set("toJSON", { virtuals: true });
batchSchema.set("toObject", { virtuals: true });
batchSchema.index({ branch: 1, name: 1 }, { unique: true });


// ==========================================
// 2. BATCH SUBJECT SCHEMA
// ==========================================
const batchSubjectSchema = new mongoose.Schema(
  {
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    primaryTeacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    syllabusCompletionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["ONGOING", "COMPLETED", "HOLD"],
      default: "ONGOING",
    },
  },
  { timestamps: true }
);
batchSubjectSchema.index({ batch: 1, subject: 1 }, { unique: true });


// ==========================================
// 3. ROUTINE SLOT SCHEMA
// ==========================================
const routineSlotSchema = new mongoose.Schema(
  {
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    day: {
      type: String,
      enum: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    },
    isChanged: { type: Boolean, default: false },
  },
  { timestamps: true }
);


// ==========================================
// 4. SLOT BATCH ASSIGNMENT SCHEMA
// ==========================================
const slotBatchAssignmentSchema = new mongoose.Schema(
  {
    routineSlot: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RoutineSlot",
      required: true,
    },
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
slotBatchAssignmentSchema.index({ routineSlot: 1, batch: 1 }, { unique: true });

// ==========================================
// EXPORTS (These names MUST match the refs above)
// ==========================================
export const Batch = mongoose.model("Batch", batchSchema);
export const BatchSubject = mongoose.model("BatchSubject", batchSubjectSchema);
export const RoutineSlot = mongoose.model("RoutineSlot", routineSlotSchema);
export const SlotBatchAssignment = mongoose.model("SlotBatchAssignment", slotBatchAssignmentSchema);