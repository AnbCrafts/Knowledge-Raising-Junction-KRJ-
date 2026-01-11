import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC COURSE INFO
    ========================== */
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true
    },

    shortDescription: {
      type: String,
      maxlength: 500
    },

    description: {
      type: String,
      required: true
    },

    /* =========================
       CATEGORY & TAGGING
    ========================== */
    category: {
      type: String,
      required: true,
      index: true
    },

    subCategory: {
      type: String
    },

    tags: [
      {
        type: String,
        index: true
      }
    ],

    level: {
      type: String,
      enum: ["BEGINNER", "INTERMEDIATE", "ADVANCED"],
      default: "BEGINNER"
    },

    language: {
      type: String,
      default: "English"
    },

    /* =========================
       PRICING
    ========================== */
    price: {
      type: Number,
      required: true
    },

    discountPrice: {
      type: Number
    },

    discountValidTill: {
      type: Date
    },

    isFree: {
      type: Boolean,
      default: false
    },

    /* =========================
       MEDIA
    ========================== */
    thumbnailUrl: {
      type: String,
      required: true
    },

    previewVideoUrl: {
      type: String
    },

    /* =========================
       COURSE METRICS
    ========================== */
    totalDurationInHours: {
      type: Number
    },

    totalLectures: {
      type: Number
    },

    totalResources: {
      type: Number
    },

    /* =========================
       INSTRUCTOR INFO
    ========================== */
    instructorName: {
      type: String,
      required: true
    },

    instructorBio: {
      type: String
    },

    /* =========================
       PUBLISHING CONTROL
    ========================== */
    status: {
      type: String,
      enum: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      default: "DRAFT",
      index: true
    },

    publishedAt: {
      type: Date
    },

    isActive: {
      type: Boolean,
      default: true
    },

    /* =========================
       ACCESS POLICY
    ========================== */
    accessType: {
      type: String,
      enum: ["LIFETIME", "TIME_BOUND"],
      default: "LIFETIME"
    },

    accessDurationInDays: {
      type: Number
    },

    /* =========================
       SALES & STATS
    ========================== */
    totalEnrollments: {
      type: Number,
      default: 0
    },

    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },

    totalReviews: {
      type: Number,
      default: 0
    },

    /* =========================
       SEO
    ========================== */
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },

    /* =========================
       ADMIN / AUDIT
    ========================== */
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EComAdmin",
      required: true
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EComAdmin"
    }
  },
  {
    timestamps: true
  }
);

/* =========================
   INDEXES
========================== */
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ price: 1 });
CourseSchema.index({ tags: 1 });

export default mongoose.model("Course", CourseSchema);
