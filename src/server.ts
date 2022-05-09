import bodyParser from "body-parser";
import express, {
  ErrorRequestHandler,
  NextFunction,
  RequestHandler,
} from "express";
import { ValidationError } from "yup";
import AuthController from "./controllers/AuthController";
import { BaseController } from "./controllers/BaseController";
import HelloController from "./controllers/HelloController";
import errorHandlersMiddleware from "./middlewares/errorHandlersMiddleware";

// Basics of express application
const server = express();

server.use(bodyParser.json());
// server.use(methodOverride());

// Register all Controllers of application
const controllers: { [baseRoute: string]: BaseController } = {
  "/hello": new HelloController(),
  "/auth": new AuthController(),
};

// Register the middlewares, to run before all routes
for (const controllerRoute in controllers) {
  const controller = controllers[controllerRoute];
  if (controller.middlewares) {
    server.use(controller.middlewares());
  }
}

// Register the API's
for (const controllerRoute in controllers) {
  const controller = controllers[controllerRoute];
  server.use(controllerRoute, controller.router());
}

server.use(...errorHandlersMiddleware);

export default server;
