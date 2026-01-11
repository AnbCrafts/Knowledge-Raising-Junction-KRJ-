import Joi from "joi";
import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../../Schema/Management/Student/Student.Schema.js";
import { Branch } from "../../../Schema/Management/Branch/Branch.Schema.js";

const studentUpdateValidationSchema = Joi.object({
  fatherName: Joi.string().min(2).optional(),
  motherName: Joi.string().min(2).optional(),
  bloodGroup: Joi.string().valid("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-").optional(),
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

  status: Joi.string().valid("ACTIVE", "LEFT", "INACTIVE").optional(),
});

const updateStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  if (!studentId) throw new ApiError(400, "Student ID is required");

  const { error, value } = studentUpdateValidationSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    throw new ApiError(
      400,
      "Validation failed",
      error.details.map((d) => ({ field: d.path.join("."), message: d.message }))
    );
  }

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  const oldBranchId = student.branch?.toString();
  const newBranchId = value.branch?.toString();

  // Deep merge for contact and avoid later overwrite by Object.assign
  const { contact, ...rest } = value;
  if (contact) {
    student.contact = {
      ...(student.contact || {}),
      ...contact,
    };
  }

  Object.assign(student, rest);
  await student.save();

  if (newBranchId && newBranchId !== oldBranchId) {
    if (oldBranchId) {
      await Branch.updateOne(
        { _id: oldBranchId },
        { $pull: { students: student._id } }
      );
    }

    await Branch.updateOne(
      { _id: newBranchId },
      { $addToSet: { students: student._id } }
    );
  }

  // Sanitize sensitive fields before returning
  const result = student.toObject ? student.toObject() : { ...student };
  if (result.password) delete result.password;
  if (result.__v !== undefined) delete result.__v;

  return successResponse(res, {
    message: "Student updated successfully",
    data: result,
  });
});

export default updateStudent;
