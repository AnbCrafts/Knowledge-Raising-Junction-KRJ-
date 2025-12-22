import ApiError from "../../Utility/Response/ErrorResponse.Utility.js";

const errorHandler = (err, req, res, next) => {
  let error = err;

  
  // This handles generic DB errors or Node crashes.
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors || [], err.stack);
  }

  //  response object
  const response = {
    statusCode: error.statusCode,
    success: false,
    message: error.message,
    errors: error.errors,
    
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  };

  // 3. Send the response
  return res.status(error.statusCode).json(response);
};

export { errorHandler };