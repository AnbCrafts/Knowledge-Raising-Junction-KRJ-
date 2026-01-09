import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
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
    description: {
      type: String,
    },
    type: {
      type: String,
      enum: ["THEORY", "LAB", "SEMINAR", "OPTIONAL"],
      default: "THEORY",
    },

    batches: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true,
    }],
    routines: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Routine",
      required: true,
      index: true,
    }],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        default: [],
      },
    ],
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        default: [],
      },
    ],
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
        default: [],
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        default: [],
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    deletedAt: {
      type: Date,
      default: null
    },

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null
    },

    deleteReason: {
      type: String,
      trim: true
    },
    syllabusCompletion: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",

    },
  },
  { timestamps: true }
);

subjectSchema.index({ batch: 1, code: 1 }, { unique: true });

export const Subject = mongoose.model("Subject", subjectSchema);
