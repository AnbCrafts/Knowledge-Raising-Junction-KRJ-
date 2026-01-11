import mongoose from "mongoose";

const CourseContentSchema = new mongoose.Schema(
  {
    /* =========================
       COURSE LINK
    ========================== */
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true
    },

    /* =========================
       CONTENT INFO
    ========================== */
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String
    },

    type: {
      type: String,
      enum: ["VIDEO", "PDF", "QUIZ", "ASSIGNMENT"],
      required: true,
      index: true
    },

    order: {
      type: Number,
      required: true
    },

    /* =========================
       CONTENT STORAGE
    ========================== */
    contentUrl: {
      type: String,
      required: true
    },

    durationInMinutes: {
      type: Number
    },

    fileSizeMB: {
      type: Number
    },

    /* =========================
       ACCESS CONTROL
    ========================== */
    isFreePreview: {
      type: Boolean,
      default: false,
      index: true
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /* =========================
       QUIZ / ASSIGNMENT (OPTIONAL)
    ========================== */
    meta: {
      type: mongoose.Schema.Types.Mixed
    },

    /* =========================
       AUDIT
    ========================== */
    createdBy: {
      type: String,
      default: "SUPER_ADMIN"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
========================== */
CourseContentSchema.index({ course: 1, order: 1 });
CourseContentSchema.index({ course: 1, type: 1 });

export default mongoose.model("CourseContent", CourseContentSchema);
