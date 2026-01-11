import Joi from "joi";
import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../../Schema/Management/Student/Student.Schema.js";
import { Branch } from "../../../Schema/Management/Branch/Branch.Schema.js";

const studentIdParamSchema = Joi.object({
  studentId: Joi.string().length(24).required(),
});

const deleteStudent = asyncHandler(async (req, res) => {
  const { error } = studentIdParamSchema.validate(req.params);
  if (error) throw new ApiError(400, "Invalid student ID");

  const { studentId } = req.params;

  const student = await Student.findById(studentId);
  if (!student) throw new ApiError(404, "Student not found");

  if (student.branch) {
    await Branch.updateOne(
      { _id: student.branch },
      { $pull: { students: student._id } },
      { strict: false }
    );
  }

  student.status = "INACTIVE";
  student.leavingDate = new Date();
  await student.save();

  return successResponse(res, {
    message: "Student deleted successfully",
    data: { studentId, status: student.status },
  });
});

export default deleteStudent;
