import mongoose from "mongoose";

const BranchSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    address: {
      type: String,
      default: "",
    },
    branchCode:{
      type: String,
      required: true,
      trim: true,
      unique:true
    },

    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],

    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],

    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],

    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
      },
    ],

    managedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const Branch = mongoose.model("Branch", BranchSchema);
