import { Branch } from "../../Schema/Branch/Branch.Schema.js";
import { asyncHandler } from "../../Utility/Response/AsyncHandler.Utility.js";
import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";

const attachBranchContext = asyncHandler(async (req, res, next) => {
  const branchId = req.query.branchId || req.headers["x-branch-id"];

  if (!branchId) {
    throw new ApiError(400, "branchId is required");
  }

  const branch = await Branch.findById(branchId).select("_id batches");
  if (!branch) {
    throw new ApiError(404, "Branch not found");
  }

  req.branch = {
    _id: branch._id,
    batchIds: branch.batches.map(b => b.toString())
  };

  next();
});


export default attachBranchContext
