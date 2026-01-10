import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    // 1. LINK TO USER (LOGIN / AUTH)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    idCard:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "IDCard",
        required: true,
    },

    // 2. BASIC EMPLOYEE INFO
    employeeCode: {
      type: String,
      required: true,
      unique: true, // e.g. EMP-2025-001
      trim: true,
    },

    designation: {
      type: String, // Teacher, Senior Teacher, Counselor, Manager, Accountant
      required: true,
    },

    department: {
      type: String, // Academic, Admin, Finance, Operations
      required: true,
    }, 

    // 3. BRANCH ASSOCIATION
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
    ],
    attendance:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Attendance",
        required: true,
        }
    ],
    holidays:[
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Leave",
        required: true,
        }
    ],
    

    // 4. EMPLOYMENT DETAILS
    employmentType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "CONTRACT"],
      default: "FULL_TIME",
    },

    joiningDate: {
      type: Date,
      required: true,
    },

    exitDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "ON_LEAVE", "RESIGNED", "TERMINATED"],
      default: "ACTIVE",
    },
 
    previousEmployment: [
      {
        organization: String,
        role: String,
        startDate: Date,
        endDate: Date,
        referenceContact: String,
      },
    ],
    // 5. PAYROLL / HR
    salaryType: {
      type: String,
      enum: ["MONTHLY", "HOURLY", "PER_CLASS"],
      default: "MONTHLY",
    },
    receivedPayRolls:[
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment",
        required: true,
      }
    ], 

    salaryAmount: {
      type: Number,
      default: 0,
    },

    bankDetails: {
      accountHolderName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },

    // 6. DOCUMENTS & VERIFICATION
    documents: {
      idProof: String,
      addressProof: String,
      resume: String,
      offerLetter: String,
      certificates: [String],
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // 7. WORK METRICS (USEFUL FOR TEACHERS TOO)
    experienceYears: {
      type: Number,
      default: 0,
    },

    remarks: {
      type: String,
      default: "",
    },
     availableToday: {
      type: Boolean,
      default: true,
    },



    

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
     deletedAt: {
      type: Date,
      default: null,
    },


  },
  { timestamps: true }
);

// INDEXES
employeeSchema.index({ employeeCode: 1 });
employeeSchema.index({ designation: 1 });
employeeSchema.index({ department: 1 });
employeeSchema.index({ status: 1 });

export const Employee = mongoose.model("Employee", employeeSchema);
