import { IRouter, Router } from "express";

export interface BaseController {
  middlewares?: () => IRouter;
  router(): IRouter;
}
