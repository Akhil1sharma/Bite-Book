const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Wrong mongoose ObjectId
  if (err.name === "CastError") {
    error = new ErrorResponse("Resource not found", 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error = new ErrorResponse("Duplicate field value entered", 400);
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(val => val.message).join(", ");
    error = new ErrorResponse(message, 400);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || "Server Error",
  });
};

module.exports = errorHandler;
