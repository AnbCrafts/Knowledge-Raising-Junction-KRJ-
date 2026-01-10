import mongoose from "mongoose";

const idCardSchema = new mongoose.Schema(
  {
    holderType: {
      type: String,
      enum: ["STUDENT", "EMPLOYEE"],
      required: true,
    },

    holderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    idNumber: {
      type: String,
      required: true,
      unique: true,
    },
 
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },

    photo: {
      type: String, // profile photo URL
      required: true,
    },

    qrCode: {
      type: String, // QR code image or encoded value
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    expiryDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "SUSPENDED", "REISSUED"],
      default: "ACTIVE",
    },

    printedCount: {
      type: Number,
      default: 0, // track reprints
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

idCardSchema.index({ holderType: 1, holderId: 1 }, { unique: true });
 
export const IDCard = mongoose.model("IDCard", idCardSchema);
