import { ErrorRequestHandler } from "express";
import { ApiError } from "../../lib/ApiError";

const apiErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      error: err.message,
    });
  } else {
    return next();
  }
};

export default apiErrorHandler;
