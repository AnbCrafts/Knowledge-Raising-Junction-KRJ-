import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    // 1. Teacher is a User (Authentication)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // A user should only have one teacher profile
    }, 

    // 2. Teacher is an Employee (HR/Payroll)
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true, // One employee record per teacher
    },

    // 3. Professional Stats
    experience: {
      type: Number,
      default: 0,
    },
    totalSubjects: {
      type: Number,
      default: 0,
    },
    totalStudents: {
      type: Number,
      default: 0,
    },
    
    // Storing ratings as an array of objects is better than raw JSON for querying
    ratings: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
        rating: Number,
        review: String,
        date: { type: Date, default: Date.now },
      },
    ],

    // 4. Status & Documents
    documents: {
      type: String, // URL to document storage
      default: "",
    },
    availableToday: {
      type: Boolean,
      default: true,
    },
    profileComplete: {
      type: Boolean,
      default: false,
    },
    documentsUploaded: {
      type: Boolean,
      default: false,
    },

    // 5. Relationships (Previously separate SQL tables)
    // Instead of 'teacher_branch' table, we use an array here
    
    batches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Batch",
      },
    ],

    // Instead of 'teacher_routine' table
    routines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Routine",
      },
    ],
    tests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Test",
      },
    ],
    assignments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
      },
    ],

    // Instead of 'teacher_students' table
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    subjects: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    
    
    ratings: [
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    rating: { type: Number, min: 1, max: 5 },
    review: String,
    date: { type: Date, default: Date.now },
  },
],

  },
  { timestamps: true } // Automatically adds createdAt and updatedAt
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;