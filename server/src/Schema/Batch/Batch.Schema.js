import mongoose from "mongoose";
 

const batchSchema = new mongoose.Schema(
  {
    branches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    }], 

    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {       //KRJ-Year-name_of_batch
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

    mentors: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      default: null,
    }],

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
      ref: "Subject", // FIXED: Must match the Model name exported below
      default: null,
    }],
    students: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student", // FIXED: Must match the Model name exported below
      default: null,
    }],

    // 2. Routine Array
    // CHANGED: Made this an Array []. A batch cannot have just ONE routine slot.
    routine: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routine", // FIXED
    }],

    // 3. Assignments (Junction Table Links)
    assignments: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment" // FIXED
    }],
    tests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tes" // FIXED
    }],
    createdBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
     
    }
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


export const Batch = mongoose.model("Batch", batchSchema);
