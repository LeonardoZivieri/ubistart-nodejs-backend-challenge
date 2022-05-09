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

export default class AuthController implements BaseController {
  prismaClient: PrismaClient;
  constructor({ prismaClient = new AppPrismaClient() } = {}) {
    this.prismaClient = prismaClient;
  }

  middlewares(): IRouter {
    const router = Router();

    router.use((req, res, next) => {
      const required = async () => {
        const user = validate();
        if (!user) {
          throw new ApiError(401, "Unauthorized");
        }
      };
      const validate = async () => {
        console.log(req.headers.authorization);
      };
      req.authInformation = { required, validate };
      next();
    });

    return router;
  }

  router(): IRouter {
    const router = Router();

    router.post("/register", this.createUser);
    router.post("/authenticate", this.authenticate);
    router.post("/refresh-token", this.refreshToken);

    return router;
  }

  private authenticateValidation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Email needs to be valid"),
    password: Yup.string().required("Password is required"),
  }).required();

  authenticate: RequestHandler = async (req, res, next) => {
    try {
      let body = await this.authenticateValidation.validate(req.body);

      let userWithEmail = await this.prismaClient.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (
        userWithEmail &&
        databaseUserPasswordValidator(userWithEmail, body.password) == false
      ) {
        userWithEmail = null;
      }

      if (!userWithEmail) {
        return res.status(401).end();
      }

      return res.status(200).json({
        user: userWithEmail,
        auth: serverAuthorizeUserGetToken(userWithEmail),
      });
    } catch (error) {
      return next(error);
    }
  };

  private createUserValidation = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Email needs to be valid"),
    password: Yup.string().required("Password is required"),
  }).required();

  createUser: RequestHandler = async (req, res, next) => {
    try {
      const body = await this.createUserValidation.validate(req.body);

      const emailExists = await this.prismaClient.user.count({
        where: {
          email: body.email,
        },
      });

      if (emailExists != 0) {
        return res.status(409).json("User already registered");
      }

      const createdUser = await this.prismaClient.user.create({
        data: {
          email: body.email,
          ...databaseUserPasswordRegister(body.password),
        },
      });

      return res.status(201).json({
        user: createdUser,
        auth: serverAuthorizeUserGetToken(createdUser),
      });
    } catch (error) {
      return next(error);
    }
  };

  private refreshTokenValidation = Yup.object({
    token: Yup.string().required(),
  }).required();

  refreshToken: RequestHandler = async (req, res, next) => {
    try {
      const { token } = await this.refreshTokenValidation.validate(req.body);

      const user = await serverAuthorizeValidateRefreshToken(
        token,
        this.prismaClient
      );

      if (!user) {
        throw new ApiError(401, "Unable to refresh token");
      }

      const auth = serverAuthorizeUserGetToken(user);

      return res.status(200).json({
        user,
        auth,
      });
    } catch (error) {
      return next(error);
    }
  };
}
