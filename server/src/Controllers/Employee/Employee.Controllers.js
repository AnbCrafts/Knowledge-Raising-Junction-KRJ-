import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import Joi from 'joi';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';

// Validations
import { fullName, email, phone, username, password, role, createdBy, objectId } from "../../Validations/User/User.Validations.js";
import { employeeCode, designation, department, branches, employmentType, joiningDate, salaryType, salaryAmount, bankDetails, documents, experienceYears } from "../../Validations/Employee/Employee.Validations.js";
import { batches, routines } from "../../Validations/Teacher/Teacher.validations.js"; // Removed unused imports

// Models & Utils
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { User } from "../../Schema/User/User.Schema.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";
import CounterSchema from "../../Schema/Counter/Counter.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import { RoutineSlot } from "../../Schema/Routine/Routine.Schema.js";
import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";
import { IDCard } from "../../Schema/IDCard/IDCard.Schema.js";
import { Leave } from "../../Schema/Leave/Leave.Schema.js";


// Validations
const empProfileValidationSchema = Joi.object({
    fullName: fullName.required(),
    email: email.required(),
    username: username.required(),
    password: password.required(),
    phone: phone.required(),
    role: role.required(),
    createdBy: createdBy.required(),
    designation: designation.required(),
    department: department.required(),
    branches: branches.required(),
    employmentType: employmentType.required(),
    joiningDate: joiningDate.required(),
    salaryType: salaryType.required(),
    salaryAmount: salaryAmount.required(),
    bankDetails: bankDetails.required(),
    documents: documents.required(),
    experienceYears: experienceYears.required(),
    batches: batches.required(),
    routines: routines.required()
});
const employeeBranchValidationSchema = Joi.object({
    branches:branches.required(),
    employeeId:objectId.required()
})

// POST Methods
const createEmployerProfile = asyncHandler(async (req, res) => {
    let session;
    try {
        // 1. Start Session
        session = await mongoose.startSession();
        session.startTransaction();

        // 2. Validate Input
        const { error, value } = empProfileValidationSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true
        });

        if (error) {
            throw new ApiError(
                400,
                "Validation failed",
                error.details.map((d) => ({
                    field: d.path.join("."),
                    message: d.message
                }))
            );
        }

        // Destructure Validated Data
        const {
            fullName, email, username, password, phone, role, createdBy,
            designation, department, branches, employmentType, joiningDate,
            salaryType, salaryAmount, bankDetails, documents, experienceYears,
            batches, routines
        } = value;

        // 3. Check for Existing User (Pass session for read consistency)
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        }).session(session);

        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }

        // 4. Create User
        const SALT_ROUNDS = Number(process.env.BCRYPT_SALT) || 10;
        const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);

        const newUsers = await User.create([{
            fullName,
            email,
            username,
            password: hashedPass,
            phone,
            role,
            createdBy,
        }], { session });

        const createdUser = newUsers[0]; 

        if (!createdUser) {
            throw new ApiError(500, "User Profile Creation failed");
        }

        // 5. Generate Employee Code
        const year = new Date(joiningDate).getFullYear();
        
        const counter = await CounterSchema.findOneAndUpdate(
            { key: `EMPLOYEE_${year}` },
            { $inc: { seq: 1 } },
            { new: true, upsert: true, session } 
        );

        if (!counter) throw new ApiError(500, "Failed to generate sequence");

        const generatedEmpCode = `KRJ-EMP-${year}-${String(counter.seq).padStart(3, "0")}`;

        
        const empCodeValidation = employeeCode.required().validate(generatedEmpCode);
        
        if (empCodeValidation.error) {
            throw new ApiError(400, "Generated Employee Code is invalid: " + empCodeValidation.error.message);
        }

        // 6. Create Employee
        const newEmployees = await Employee.create([{
            userId: createdUser._id,
            employeeCode: generatedEmpCode, // Use the generated code variable
            designation,
            department,
            branches,
            employmentType,
            joiningDate,
            salaryType,
            salaryAmount,
            bankDetails,
            documents,
            experienceYears,
            createdBy,
        }], { session });

        const createdEmployee = newEmployees[0];

        if (!createdEmployee) {
            throw new ApiError(500, "Employee Profile Creation failed");
        }
         const employeeId = createdEmployee._id;

  
            await Branch.updateMany(
                { _id: { $in: branches } },
                { $addToSet: { employees: employeeId } }, 
                { session }
            );


        // 7. Create Teacher
        const newTeachers = await Teacher.create([{
            userId: createdUser._id,
            employeeId: createdEmployee._id,
            batches,
            routines,
        }], { session });

        const createdTeacher = newTeachers[0];

        if (!createdTeacher) {
            throw new ApiError(500, "Teacher Profile Creation failed");
        }

        const teacherId = createdTeacher._id;
        await Batch.updateMany(
                { _id: { $in: batches } },
                { $addToSet: { mentors: teacherId } }, 
                { session }
            );
        await RoutineSlot.updateMany(
                { _id: { $in: routines } },
                { $addToSet: { teachers: teacherId } }, 
                { session }
            );

        // 8. Commit Transaction
        await session.commitTransaction();

        return successResponse(res, {
            statusCode: 201,
            message: "Employee created successfully",
            data: {
                userId: createdUser._id,
                employeeId: createdEmployee._id,
                teacherId: createdTeacher._id,
                employeeCode: createdEmployee.employeeCode,
                localPassword:password
            },
        });

    } catch (error) {
        // Safe abort
        if (session) {
            await session.abortTransaction();
        }
        throw error;
    } finally {
        // Safe end
        if (session) {
            session.endSession();
        }
    }
});
const assignBranchToEmployee = asyncHandler(async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    
    const { error, value } = employeeBranchValidationSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      throw new ApiError(
        400,
        "Validation failed",
        error.details.map((d) => ({
          field: d.path.join("."),
          message: d.message,
        }))
      );
    }

   
    const { branches } = value;
    const { employeeId } = req.params;

    
    const employee = await Employee.findById(employeeId).session(session);
    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    
    await Employee.updateOne(
      { _id: employeeId },
      { $addToSet: { branches: { $each: branches } } },
      { session }
    );

   
    await Branch.updateMany(
      { _id: { $in: branches } },
      { $addToSet: { employees: employeeId } },
      { session }
    );


    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Branch assigned successfully",
    });

  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});
const requestForHoliday = asyncHandler(async(req,res)=>{
     const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;
  const { branch, startDate, endDate, reason } = req.body;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  
  if (!employee.branches.includes(branch)) {
    throw new ApiError(403, "Employee not assigned to this branch");
  }

  
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start > end) {
    throw new ApiError(400, "Start date cannot be after end date");
  }

  
  const ONE_DAY = 24 * 60 * 60 * 1000;
  const durationDays =
    Math.floor((end - start) / ONE_DAY) + 1;

 
  const leave = await Leave.create({
    applicantId: employeeId,
    applicantType: "EMPLOYEE",
    branch,
    startDate: start,
    endDate: end,
    durationDays,
    reason,
    status: "PENDING",
  });

  const populatedLeave = await Leave.findById(leave._id)
  .populate({
    path: "branch",
    select: "name code",
  })
  .lean();


  return successResponse(res, {
  statusCode: 201,
  message: "Leave request submitted successfully",
  data: {
    branch: populatedLeave.branch,
    fromDate: populatedLeave.startDate,
    toDate: populatedLeave.endDate,
    reason: populatedLeave.reason,
    status: populatedLeave.status,
  },
});

})



// GET Methods
const getEmployeeProfile = asyncHandler(async (req, res) => {
  
  const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;

  
  const employee = await Employee.findById(employeeId)
    .populate({
      path: "userId",
      select: "-password -__v",
    })
    .lean();

  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  const teacher = await Teacher.findOne({ employeeId }).lean();

  return successResponse(res, {
    message: "Employee profile fetched successfully",
    data: {
      employee,
      user: employee.userId,
      teacher,
    },
  });
});
const getEmployeeAttendance = asyncHandler(async (req, res) => {
  
  const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;
  const { branchId, date, from, to } = req.query;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

 
  const query = { employeeId };

  // Branch-wise filter
  if (branchId) {
    const branchErr = objectId.required().validate(branchId);
    if (branchErr.error) {
      throw new ApiError(400, "Invalid branchId");
    }
    query.branchId = branchId;
  }

  // Date-wise filters
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    query.date = { $gte: start, $lt: end };
  }

  // Date-range filter
  if (from || to) {
    query.date = {};
    if (from) query.date.$gte = new Date(from);
    if (to) query.date.$lte = new Date(to);
  }

  
  const attendance = await Attendance.find(query)
    .sort({ date: -1 })
    .lean();

  return successResponse(res, {
    message: "Employee attendance fetched successfully",
    data: {
      employeeId,
      filters: {
        branchId: branchId || null,
        date: date || null,
        from: from || null,
        to: to || null,
      },
      attendance,
    },
  });
});
const getAllBranchesOfEmployee = asyncHandler(async(req,res)=>{
    const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;

  
  const employee = await Employee.findById(employeeId)
  .populate({
      path: "branches",
      select: "name address batchCode isActive", 
    })
    .lean();
    
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }


  return successResponse(res, {
    message: "All branches of employee fetched successfully",
    data: {
      employee,
      
    },
  });
})
const getEmployeeIDCard = asyncHandler(async(req,res)=>{
     const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;

 
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

 
  const idCard = await IDCard.findOne({ employeeId })
    
  return successResponse(res, {
    message: "Employee IdCard fetched successfully",
    data: {
      employeeId,
      idCard,
    },
  });
    
})
const getEmployeeHolidays = asyncHandler(async (req, res) => {
  
  const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;
  const { status, branchId, date, from, to, year } = req.query;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  
  const query = {
    applicantType: "EMPLOYEE",
    applicantId: employeeId,
  };

  // Status filter
  if (status) {
    const allowedStatus = ["PENDING", "APPROVED", "REJECTED", "CANCELLED"];
    if (!allowedStatus.includes(status)) {
      throw new ApiError(400, "Invalid leave status");
    }
    query.status = status;
  }

  // Branch filter (if Leave is branch-aware)
  if (branchId) {
    const branchErr = objectId.required().validate(branchId);
    if (branchErr.error) {
      throw new ApiError(400, "Invalid branchId");
    }
    query.branchId = branchId;
  }

  // Specific date
  if (date) {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);

    const end = new Date(start);
    end.setDate(end.getDate() + 1);

    query.startDate = { $lte: end };
    query.endDate = { $gte: start };
  }

  // Date range
  if (from || to) {
    query.startDate = {};
    query.endDate = {};

    if (from) query.startDate.$gte = new Date(from);
    if (to) query.endDate.$lte = new Date(to);
  }

  // Year filter
  if (year) {
    const y = Number(year);
    if (Number.isNaN(y)) {
      throw new ApiError(400, "Invalid year");
    }

    const yearStart = new Date(y, 0, 1);
    const yearEnd = new Date(y + 1, 0, 1);

    query.startDate = { $gte: yearStart };
    query.endDate = { $lt: yearEnd };
  }

  
  const holidays = await Leave.find(query)
    .sort({ startDate: -1 })
    .lean();

  return successResponse(res, {
    message: "Employee holidays fetched successfully",
    data: {
      employeeId,
      filters: {
        status: status || "ALL",
        branchId: branchId || null,
        date: date || null,
        from: from || null,
        to: to || null,
        year: year || null,
      },
      holidays,
    },
  });
});












 







export { createEmployerProfile,assignBranchToEmployee,getEmployeeProfile,getEmployeeAttendance,getAllBranchesOfEmployee,getEmployeeIDCard,getEmployeeHolidays,requestForHoliday };




const getEmployeeAttendanceByBranch = asyncHandler(async (req, res) => {
  
  const empErr = objectId.required().validate(req.params.employeeId);
  if (empErr.error) {
    throw new ApiError(400, empErr.error.message);
  }

  
  const branchErr = objectId.required().validate(req.query.branchId);
  if (branchErr.error) {
    throw new ApiError(400, branchErr.error.message);
  }

  const { employeeId } = req.params;
  const { branchId } = req.query;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  
  const attendance = await Attendance.find({
    employeeId,
    branchId,
  })
    .sort({ date: -1 })
    .lean();

  return successResponse(res, {
    message: "Employee attendance fetched successfully for this branch",
    data: {
      employeeId,
      branchId,
      attendance,
    },
  });
});
const getEmployeeAttendanceToday = asyncHandler(async(req,res)=>{
   const { error } = objectId.required().validate(req.params.employeeId);
  if (error) {
    throw new ApiError(400, error.message);
  }

  const { employeeId } = req.params;

  const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

 
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

 
  const attendance = await Attendance.findOne({
  employeeId,
  date: { $gte: today, $lt: tomorrow },
});

  return successResponse(res, {
    message: "Employee attendance fetched successfully for today",
    data: {
      employeeId,
      attendance,
    },
  }); 
});
const getEmployeeAttendanceTodayByBranch = asyncHandler(async(req,res)=>{
   const empErr = objectId.required().validate(req.params.employeeId);
  if (empErr.error) {
    throw new ApiError(400, empErr.error.message);
  }

  
  const branchErr = objectId.required().validate(req.query.branchId);
  if (branchErr.error) {
    throw new ApiError(400, branchErr.error.message);
  }

  const { employeeId } = req.params;
  const { branchId } = req.query;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  
 const today = new Date();
today.setHours(0, 0, 0, 0);

const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);

const attendance = await Attendance.findOne({
  employeeId,
  branchId,
  date: { $gte: today, $lt: tomorrow },
});


  return successResponse(res, {
    message: "Employee attendance fetched successfully for this branch today",
    data: {
      employeeId,
      branchId,
      attendance,
    },
  });
});