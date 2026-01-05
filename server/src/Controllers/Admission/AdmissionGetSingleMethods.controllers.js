import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../Schema/Student/Student.Schema.js";

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

  return successResponse(res, {
    message: "Student fetched successfully",
    data: student,
  });
});

export default getSingleStudent;
