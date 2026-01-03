import Joi from "joi";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import { address, areaCode, batches, employees, isActive, managedBy, name, objectId, students } from "../../Validations/Branch/Branch.Validations.js";
import { Admin } from "../../Schema/Admin/Admin.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { Student } from "../../Schema/Student/Student.Schema.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";
import { Batch } from "../../Schema/Batch/Batch.Schema.js";
import CounterSchema from "../../Schema/Counter/Counter.Schema";


const branchCreationValidationSchema = Joi.object({
    name:name.required(),
    address:address.required(), 
    batches:batches.optional(),
    students:students.optional(),
    employees:employees.optional(),
    managedBy:managedBy.required(),
    isActive:isActive.optional(),
    areaCode:areaCode.required(),
})

const studentToAddToBranchValidationSchema = Joi.object({
    
    students:students.required()
})
const batchToAddToBranchValidationSchema = Joi.object({
    batches:batches.required()
})

const employeesToAddToBranchValidationSchema = Joi.object({
    employees:employees.required()
})


const createBranch = asyncHandler(async (req, res) => {
  let session;

  try {
    const { error, value } = branchCreationValidationSchema.validate(req.body, {
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

    const {
      name,
      address,
      batches = [],
      students = [],
      employees = [],
      managedBy,
      isActive,
      areaCode,
      startYear,
    } = value;

    const admins = await Admin.find({
  _id: { $in: managedBy },
});

if (!admins.length || admins.length !== managedBy.length) {
  throw new ApiError(403, "One or more managing admins are invalid");
}

const hasPermission = admins.some(
  (admin) =>
    admin.permissions &&
    admin.permissions.includes("manage_branches")
);

if (!hasPermission) {
  throw new ApiError(
    403,
    "At least one admin with manage_branches permission is required"
  );
}


    session = await mongoose.startSession();
    session.startTransaction();

    const counter = await CounterSchema.findOneAndUpdate(
      { key: `BRANCH_${startYear}_${areaCode}` },
      { $inc: { seq: 1 } },
      { new: true, upsert: true, session }
    );

    const branchCode = `KRJ-${startYear}-${areaCode}-${String(
      counter.seq
    ).padStart(2, "0")}`;

    const [branch] = await Branch.create(
      [
        {
          name,
          address,
          branchCode,
          batches,
          students,
          employees,
          managedBy,
          isActive,
        },
      ],
      { session }
    );

    if (students.length) {
      await Student.updateMany(
        { _id: { $in: students } },
        { $addToSet: { branches: branch._id } },
        { session }
      );
    }

    if (employees.length) {
      await Employee.updateMany(
        { _id: { $in: employees } },
        { $addToSet: { branches: branch._id } },
        { session }
      );
    }

    if (batches.length) {
      await Batch.updateMany(
        { _id: { $in: batches } },
        { $set: { branch: branch._id } },
        { session }
      );
    }

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Branch created successfully",
      data: {
        branchId: branch._id,
        branchCode: branch.branchCode,
        name: branch.name,
        address: branch.address,
        totalStudents: students.length,
        totalBatches: batches.length,
        totalEmployees: employees.length,
        isActive: branch.isActive,
      },
    });
  } catch (error) {
    if (session) await session.abortTransaction();
    throw error;
  } finally {
    if (session) session.endSession();
  }
});

const addStudentsToBranch = asyncHandler(async (req, res) => {
  let session;

  
  const branchErr = objectId.required().validate(req.params.branchId);
  if (branchErr.error) {
    throw new ApiError(400, branchErr.error.message);
  }

  
  const { error, value } = studentToAddToBranchValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Validation failed",
      error.details.map(d => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const { branchId } = req.params;
  const { studentIds } = value;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    
    const branch = await Branch.findById(branchId).session(session);
    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    const count = await Student.countDocuments({
      _id: { $in: studentIds },
    }).session(session);

    if (count !== studentIds.length) {
      throw new ApiError(400, "One or more students not found");
    }

    
    await Branch.updateOne(
      { _id: branchId },
      { $addToSet: { students: { $each: studentIds } } },
      { session }
    );

    
    await Student.updateMany(
      { _id: { $in: studentIds } },
      { $addToSet: { branches: branchId } },
      { session }
    );

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Students added to branch successfully",
      data: {
        branchId,
        addedStudents: studentIds.length,
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addBatchesToBranch = asyncHandler(async (req, res) => {
  let session;

  const branchErr = objectId.required().validate(req.params.branchId);
  if (branchErr.error) {
    throw new ApiError(400, branchErr.error.message);
  }

  const { error, value } = batchToAddToBranchValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Validation failed",
      error.details.map(d => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const { branchId } = req.params;
  const { batches } = value;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const branch = await Branch.findById(branchId).session(session);
    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    const count = await Batch.countDocuments({
      _id: { $in: batches },
    }).session(session);

    if (count !== batches.length) {
      throw new ApiError(400, "One or more batches not found");
    }

    await Branch.updateOne(
      { _id: branchId },
      { $addToSet: { batches: { $each: batches } } },
      { session }
    );

    await Batch.updateMany(
      { _id: { $in: batches } },
      { $set: { branch: branchId } },
      { session }
    );

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Batches added to branch successfully",
      data: {
        branchId,
        addedBatches: batches.length,
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});

const addEmployeesToBranch = asyncHandler(async (req, res) => {
  let session;

  const branchErr = objectId.required().validate(req.params.branchId);
  if (branchErr.error) {
    throw new ApiError(400, branchErr.error.message);
  }

  const { error, value } = employeesToAddToBranchValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Validation failed",
      error.details.map(d => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const { branchId } = req.params;
  const { employees } = value;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const branch = await Branch.findById(branchId).session(session);
    if (!branch) {
      throw new ApiError(404, "Branch not found");
    }

    const count = await Employee.countDocuments({
      _id: { $in: employees },
    }).session(session);

    if (count !== employees.length) {
      throw new ApiError(400, "One or more employees not found");
    }

    await Branch.updateOne(
      { _id: branchId },
      { $addToSet: { employees: { $each: employees } } },
      { session }
    );

    await Employee.updateMany(
      { _id: { $in: employees } },
      { $addToSet: { branches: branchId } },
      { session }
    );

    await session.commitTransaction();

    return successResponse(res, {
      statusCode: 201,
      message: "Employees added to branch successfully",
      data: {
        branchId,
        addedEmployees: employees.length,
      },
    });
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) session.endSession();
  }
});




export {createBranch,addStudentsToBranch,addBatchesToBranch,addEmployeesToBranch}