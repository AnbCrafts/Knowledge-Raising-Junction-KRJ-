import { asyncHandler } from "../../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../../Schema/Management/Student/Student.Schema.js";

const getSingleStudent = asyncHandler(async (req, res) => {
  const { studentId } = req.params;

  if (!studentId) {
    throw new ApiError(400, "Student ID is required");
  }
 
  const student = await Student.findById(studentId)
    .populate("branch", "name branchCode address")
    .populate("academicProfile")
    .populate("assignedTeacher", "fullName email")
    .populate("idCard")
    .lean();

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // Sanitize sensitive fields before returning
  const result = student && student.toObject ? student.toObject() : { ...(student || {}) };
  if (result.password) delete result.password;
  if (result.__v !== undefined) delete result.__v;

  return successResponse(res, {
    message: "Student fetched successfully",
    data: result,
  });
});

export default getSingleStudent;
