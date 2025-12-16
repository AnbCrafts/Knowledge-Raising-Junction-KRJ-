import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    
    batch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: true,
      index: true, // For fast lookup: "Show me assignments for Batch A"
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true, // For fast lookup: "Show me assignments for Batch A"
    },

    // Teacher who created it
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
    },

  
    dueDate: {
      type: Date,
      required: true,
    },

    maxMarks: {
      type: Number,
      default: 100,
    },

    
    FileUrl: {
      type: String,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const submissionSchema = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: true,
      index: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

   
    submissionFileUrl: {
      type: String,
      required: true,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

  
    marksObtained: {
      type: Number,
      default: null, 
    },

    teacherFeedback: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["SUBMITTED", "GRADED", "LATE", "RESUBMISSION_REQUESTED"],
      default: "SUBMITTED",
    },
  },
  { timestamps: true }
);

submissionSchema.index({ assignment: 1, student: 1 }, { unique: true });

export const Assignment = mongoose.model("Assignment", assignmentSchema);
export const Submission = mongoose.model("Submission", submissionSchema);