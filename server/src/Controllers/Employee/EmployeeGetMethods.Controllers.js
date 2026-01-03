import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import Joi from 'joi';

// Validations
import {  objectId } from "../../Validations/User/User.Validations.js";

// Models & Utils
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { Employee } from "../../Schema/Employee/Employee.Schema.js";
import Teacher from "../../Schema/Teacher/Teacher.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";
import { Attendance } from "../../Schema/Attendance/Attendance.Schema.js";
import { IDCard } from "../../Schema/IDCard/IDCard.Schema.js";
import { Leave } from "../../Schema/Leave/Leave.Schema.js";
import { Payment } from "../../Schema/Payment/Payment.Schema.js";
import { dateField, paymentMethod, paymentType, status } from "../../Validations/Payment/Payment.Validations.js";


// Validations
const paymentQueryValidationSchema = Joi.object({
  branchId: objectId.optional(),

  paymentType: paymentType.optional(),
  paymentMethod: paymentMethod.optional(),
  status: status.optional(),

  month: Joi.number().integer().min(1).max(12).optional(),
  year: Joi.number().integer().min(2000).max(2100).optional(),

  from: dateField.optional(),
  to: dateField.optional(),
})
.custom((value, helpers) => {
  if (value.from && value.to && value.from > value.to) {
    return helpers.error("any.invalid");
  }
  return value;
}, "Date range validation")
.messages({
  "any.invalid": "`from` date cannot be after `to` date",
});



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
const getEmployeePaymentSlips = asyncHandler(async (req, res) => {
  
  const empErr = objectId.required().validate(req.params.employeeId);
  if (empErr.error) {
    throw new ApiError(400, empErr.error.message);
  }

  
  const { error: queryError, value: queryValue } =
    paymentQueryValidationSchema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

  if (queryError) {
    throw new ApiError(
      400,
      "Invalid query parameters",
      queryError.details.map((d) => ({
        field: d.path.join("."),
        message: d.message,
      }))
    );
  }

  const { employeeId } = req.params;
  const {
    branchId,
    paymentType,
    paymentMethod,
    status,
    month,
    year,
    from,
    to,
  } = queryValue;

  
  const employee = await Employee.findById(employeeId).lean();
  if (!employee) {
    throw new ApiError(404, "Employee not found");
  }

  
  const query = {
    paidByType: "EMPLOYEE",
    paidById: employeeId,
  };

  if (branchId) query.branch = branchId;
  if (paymentType) query.paymentType = paymentType;
  if (paymentMethod) query.paymentMethod = paymentMethod;
  if (status) query.status = status;

  // Salary / payment period
  if (month) query["period.month"] = Number(month);
  if (year) query["period.year"] = Number(year);

  // Date range
  if (from || to) {
    query.paymentDate = {};
    if (from) query.paymentDate.$gte = new Date(from);
    if (to) query.paymentDate.$lte = new Date(to);
  }

 
  const payments = await Payment.find(query)
    .sort({ paymentDate: -1 })
    .populate({ path: "branch", select: "name code" })
    .populate({ path: "createdBy", select: "fullName email" })
    .lean();

  return successResponse(res, {
    message: "Employee payment slips fetched successfully",
    data: {
      employeeId,
      filters: {
        branchId: branchId ?? null,
        paymentType: paymentType ?? null,
        paymentMethod: paymentMethod ?? null,
        status: status ?? null,
        month: month ?? null,
        year: year ?? null,
        from: from ?? null,
        to: to ?? null,
      },
      payments,
    },
  });
});









 







export { getEmployeeProfile,getEmployeeAttendance,getAllBranchesOfEmployee,getEmployeeIDCard,getEmployeeHolidays,getEmployeePaymentSlips };




// const getEmployeeAttendanceByBranch = asyncHandler(async (req, res) => {
  
//   const empErr = objectId.required().validate(req.params.employeeId);
//   if (empErr.error) {
//     throw new ApiError(400, empErr.error.message);
//   }

  
//   const branchErr = objectId.required().validate(req.query.branchId);
//   if (branchErr.error) {
//     throw new ApiError(400, branchErr.error.message);
//   }

//   const { employeeId } = req.params;
//   const { branchId } = req.query;

  
//   const employee = await Employee.findById(employeeId).lean();
//   if (!employee) {
//     throw new ApiError(404, "Employee not found");
//   }

  
//   const attendance = await Attendance.find({
//     employeeId,
//     branchId,
//   })
//     .sort({ date: -1 })
//     .lean();

//   return successResponse(res, {
//     message: "Employee attendance fetched successfully for this branch",
//     data: {
//       employeeId,
//       branchId,
//       attendance,
//     },
//   });
// });
// const getEmployeeAttendanceToday = asyncHandler(async(req,res)=>{
//    const { error } = objectId.required().validate(req.params.employeeId);
//   if (error) {
//     throw new ApiError(400, error.message);
//   }

//   const { employeeId } = req.params;

//   const today = new Date();
// today.setHours(0, 0, 0, 0);

// const tomorrow = new Date(today);
// tomorrow.setDate(today.getDate() + 1);

 
//   const employee = await Employee.findById(employeeId).lean();
//   if (!employee) {
//     throw new ApiError(404, "Employee not found");
//   }

 
//   const attendance = await Attendance.findOne({
//   employeeId,
//   date: { $gte: today, $lt: tomorrow },
// });

//   return successResponse(res, {
//     message: "Employee attendance fetched successfully for today",
//     data: {
//       employeeId,
//       attendance,
//     },
//   }); 
// });
// const getEmployeeAttendanceTodayByBranch = asyncHandler(async(req,res)=>{
//    const empErr = objectId.required().validate(req.params.employeeId);
//   if (empErr.error) {
//     throw new ApiError(400, empErr.error.message);
//   }

  
//   const branchErr = objectId.required().validate(req.query.branchId);
//   if (branchErr.error) {
//     throw new ApiError(400, branchErr.error.message);
//   }

//   const { employeeId } = req.params;
//   const { branchId } = req.query;

  
//   const employee = await Employee.findById(employeeId).lean();
//   if (!employee) {
//     throw new ApiError(404, "Employee not found");
//   }

  
//  const today = new Date();
// today.setHours(0, 0, 0, 0);

// const tomorrow = new Date(today);
// tomorrow.setDate(today.getDate() + 1);

// const attendance = await Attendance.findOne({
//   employeeId,
//   branchId,
//   date: { $gte: today, $lt: tomorrow },
// });


//   return successResponse(res, {
//     message: "Employee attendance fetched successfully for this branch today",
//     data: {
//       employeeId,
//       branchId,
//       attendance,
//     },
//   });
// });