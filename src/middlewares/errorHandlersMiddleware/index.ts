import { ErrorRequestHandler } from "express";
import yupValidationErrorHandler from "./yupValidationErrorHandler";

const errorHandlersMiddleware: ErrorRequestHandler[] = [
    yupValidationErrorHandler
]

export default errorHandlersMiddleware;
