import Joi from "joi";

import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";

import { Student } from "../../Schema/Student/Student.Schema.js";
import { Branch } from "../../Schema/Branch/Branch.Schema.js";

/* =========================
   PARAM VALIDATION (INLINE)
   ========================= */
const studentIdParamSchema = Joi.object({
  studentId: Joi.string().length(24).required(),
});

/* =========================
   DELETE STUDENT CONTROLLER
   ========================= */
const deleteStudent = asyncHandler(async (req, res) => {
  // 1️⃣ Validate param
  const { error } = studentIdParamSchema.validate(req.params);
  if (error) {
    throw new ApiError(400, "Invalid student ID");
  }

  const { studentId } = req.params;

  // 2️⃣ Find student
  const student = await Student.findById(studentId);
  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  // 3️⃣ Remove student from branch (IMPORTANT)
  if (student.branch) {
    await Branch.updateOne(
      { _id: student.branch },
      { $pull: { students: student._id } }
    );
  }

  // 4️⃣ SOFT DELETE (recommended)
  student.status = "INACTIVE";
  student.leavingDate = new Date();
  await student.save();

  // ❌ HARD DELETE OPTION (DON’T use unless required)
  // await Student.findByIdAndDelete(studentId);

  // 5️⃣ Response
  return successResponse(res, {
    message: "Student deleted successfully",
    data: {
      studentId,
      status: student.status,
    },
  });
});

export default deleteStudent;
