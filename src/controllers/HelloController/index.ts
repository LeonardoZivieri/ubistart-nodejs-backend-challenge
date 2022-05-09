import { PrismaClient, User } from "@prisma/client";
import { IRouter, RequestHandler, Router } from "express";
import jsonwebtoken from "jsonwebtoken";
import * as Yup from "yup";
import { ApiError } from "../../lib/ApiError";
import { AppPrismaClient } from "../../lib/AppPrismaClient";
import databaseUserPasswordRegister from "../../useCases/databaseUserPasswordRegister";
import databaseUserPasswordValidator from "../../useCases/databaseUserPasswordValidator";
import serverAuthorizeUserGetToken from "../../useCases/serverAuthorizeUserGetToken";
import serverAuthorizeValidateRefreshToken from "../../useCases/serverAuthorizeValidateRefreshToken";
import { BaseController } from "../BaseController";

export default class HelloController implements BaseController {
  prismaClient: PrismaClient;
  constructor({ prismaClient = new AppPrismaClient() } = {}) {
    this.prismaClient = prismaClient;
  }

  router(): IRouter {
    const router = Router();

    router.get("", (req, res) => {
      res.status(200).send("Hello!");
    });

    return router;
  }
}
