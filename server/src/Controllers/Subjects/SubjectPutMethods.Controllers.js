import mongoose from "mongoose";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";
import { objectId } from "../../Validations/Subject/Subject.Validations.js";
import { Subject } from "../../Schema/Subjects/Subject.Schema.js";
import successResponse from "../../Utility/Response/SuccessResponse.Utility.js";


const restoreSoftDeletedSubject = asyncHandler(async (req, res) => {
  const { subjectId } = req.params;

  const { error } = objectId.required().validate(subjectId);
  if (error) {
    throw new ApiError(400, "Invalid subject ID");
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const subject = await Subject.findOne({
      _id: subjectId,
      isActive: false
    }).session(session);

    if (!subject) {
      throw new ApiError(
        400,
        "Subject not found or already active"
      );
    }

    await Subject.updateOne(
      { _id: subjectId },
      {
        $set: { isActive: true },
        $unset: {
          deletedAt: "",
          deletedBy: "",
          deleteReason: ""
        }
      },
      { session }
    );

    await session.commitTransaction();

    return successResponse(
      res,
      200,
      "Subject restored successfully"
    );
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
});
const editSubjectDetails = asyncHandler(async(req,res)=>{
    
})
