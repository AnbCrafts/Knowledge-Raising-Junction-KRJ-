import mongoose from "mongoose";

const CourseEnrollmentSchema = new mongoose.Schema(
  {
    /* =========================
       CORE REFERENCES
    ========================== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EComUser",
      required: true,
      index: true
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },

    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CoursePayment",
      required: true
    },

    /* =========================
       ACCESS CONTROL
    ========================== */
    accessType: {
      type: String,
      enum: ["LIFETIME", "TIME_BOUND"],
      default: "LIFETIME"
    },

    accessStartsAt: {
      type: Date,
      default: Date.now
    },

    accessExpiresAt: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    /* =========================
       PROGRESS TRACKING
    ========================== */
    progress: {
      percentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      completedContent: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "CourseContent"
        }
      ],
      lastAccessedAt: {
        type: Date
      }
    },

    /* =========================
       CERTIFICATE
    ========================== */
    isCompleted: {
      type: Boolean,
      default: false
    },

    completedAt: {
      type: Date
    },

    certificateUrl: {
      type: String
    },

    /* =========================
       AUDIT
    ========================== */
    enrolledAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
========================== */
CourseEnrollmentSchema.index(
  { user: 1, course: 1 },
  { unique: true }
);

export default mongoose.model(
  "CourseEnrollment",
  CourseEnrollmentSchema
);
