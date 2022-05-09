import { ErrorRequestHandler } from "express";
import { ValidationError } from "yup";

const yupValidationErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next
) => {
  if (err instanceof ValidationError) {
    res.status(400).json({
      error_type: "ValidationError",
      path: err.path,
      errors: err.errors,
    });
  } else {
    return next();
  }
};

export default yupValidationErrorHandler;
