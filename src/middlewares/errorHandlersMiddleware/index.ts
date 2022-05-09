import { ErrorRequestHandler } from "express";
import apiErrorHandler from "./apiErrorHandler";
import yupValidationErrorHandler from "./yupValidationErrorHandler";

const errorHandlersMiddleware: ErrorRequestHandler[] = [
    apiErrorHandler,
    yupValidationErrorHandler,
];

export default errorHandlersMiddleware;
