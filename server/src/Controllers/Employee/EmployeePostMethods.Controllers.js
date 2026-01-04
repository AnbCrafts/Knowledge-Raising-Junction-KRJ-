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
import { Admin } from "../../Schema/Admin/Admin.Schema.js";




// VALIDATIONS


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
    
})



// METHODS


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

        const admin = await Admin.findById(createdBy);

if (!admin) {
  throw new ApiError(403, "Invalid admin");
}

if (
  !admin.permissions ||
  !admin.permissions.includes("manage_employees")
) {
  throw new ApiError(
    403,
    "Admin does not have permission to manage employees"
  );
}


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


export {createEmployerProfile,assignBranchToEmployee,requestForHoliday}