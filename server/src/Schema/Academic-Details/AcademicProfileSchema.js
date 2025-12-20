import mongoose from "mongoose";

const AcademicProfileSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      unique: true,
    },

    // -------- CURRENT ACADEMIC STATUS --------
    academicYear: {
      type: String, // e.g. 2024-2025
      required: true,
    },

    currentClassYear: {
      type: String, // e.g. 10th, 12th, FY, SY
      required: true,
    },

    board: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    medium: {
      type: String,
      enum: ["ENGLISH", "HINDI", "OTHER"],
    },

    // -------- PREVIOUS ACADEMIC RECORDS --------
    previousAcademics: [
      {
        academicYear: String, // e.g. 2023-2024
        classYear: String, // e.g. 9th

        board: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Board",
        },

        schoolOrCollegeName: String,

        marksObtained: Number,
        totalMarks: Number,
        percentage: Number,

        resultStatus: {
          type: String,
          enum: ["PASS", "FAIL", "APPEARING"],
        },
      },
    ],

    // -------- STATUS --------
    isActive: {
      type: Boolean,
      default: true,
    },

    remarks: String,
  },
  { timestamps: true }
);

export const AcademicProfile = mongoose.model(
  "AcademicProfile",
  AcademicProfileSchema
);
