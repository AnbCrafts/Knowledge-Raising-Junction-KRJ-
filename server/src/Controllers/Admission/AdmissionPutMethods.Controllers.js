import Joi from "joi";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../Schema/Student/Student.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";

/* =========================
   UPDATE VALIDATION (INLINE)
   ========================= */
const studentUpdateValidationSchema = Joi.object({
  fatherName: Joi.string().min(2).optional(),
  motherName: Joi.string().min(2).optional(),

  bloodGroup: Joi.string()
    .valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    .optional(),

  gender: Joi.string().valid("Male", "Female", "Other").optional(),
  dob: Joi.date().optional(),

  address: Joi.string().optional(),

  contact: Joi.object({
    whatsapp: Joi.string().optional(),
    parentMobile: Joi.string().optional(),
  }).optional(),

  branch: Joi.string().length(24).optional(),
  assignedTeacher: Joi.array().items(Joi.string().length(24)).optional(),

  joiningDate: Joi.date().optional(),
  leavingDate: Joi.date().optional(),

  status: Joi.string()
    .valid("ACTIVE", "LEFT", "INACTIVE")
    .optional(),
});

/* =========================
   UPDATE STUDENT CONTROLLER
   ========================= */
const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }

  // 1️⃣ Validate request body
  const { error, value } = studentUpdateValidationSchema.validate(req.body, {
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

  // 2️⃣ Find student
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // 3️⃣ Branch change handling
  const oldBranchId = student.branch?.toString();
  const newBranchId = value.branch?.toString();

  // 4️⃣ Update student fields (PARTIAL UPDATE)
  Object.assign(student, value);
  await student.save();

  // 5️⃣ If branch changed → update Branch collection
  if (newBranchId && newBranchId !== oldBranchId) {
    // remove from old branch
    if (oldBranchId) {
      await Branch.updateOne(
        { _id: oldBranchId },
        { $pull: { students: student._id } }
      );
    }

    // add to new branch
    await Branch.updateOne(
      { _id: newBranchId },
      { $addToSet: { students: student._id } }
    );
  }

  // 6️⃣ Response
  return successResponse(res, {
    message: "Student updated successfully",
    data: student,
  });
});

export default updateStudent;
