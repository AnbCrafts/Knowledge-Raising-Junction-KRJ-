
// Response format
// `
// successResponse(res, {
//   message: "Students fetched successfully",
//   data: students,
//   meta: {
//     total,
//     page,
//     limit,
//   },
// });



// `




const successResponse = (
  res,
  {
    statusCode = 200,
    message = "Success",
    data = null,
    meta = null,
  } = {}
) => {
  const response = {
    success: true,
    message,
  };

  // Attach data only if provided
  if (data !== null && data !== undefined) {
    response.data = data;
  }

  // Attach meta only if provided (pagination, tokens, etc.)
  if (meta !== null && meta !== undefined) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

export default successResponse;




