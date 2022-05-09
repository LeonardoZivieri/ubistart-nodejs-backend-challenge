import { PrismaClient } from "@prisma/client";
import { IRouter, Request, RequestHandler, Router } from "express";
import { date, object, string } from "yup";
import { AppPrismaClient } from "../../lib/AppPrismaClient";
import { BaseController } from "../BaseController";

export default class TodoController implements BaseController {
  prismaClient: PrismaClient;
  constructor({ prismaClient = new AppPrismaClient() } = {}) {
    this.prismaClient = prismaClient;
  }

  router(): IRouter {
    const router = Router();

    router.get("", this.listTodo);
    router.post("", this.createTodo);
    router.patch("/:todo_id", this.patch);
    router.post("/:todo_id/finish", this.finish);

    return router;
  }

  private getTodoFromParams(req: Request) {
    return this.prismaClient.todo.findFirst({
      where: {
        id: +req.params.todo_id,
      },
    });
  }

  listTodo: RequestHandler = async (req, res, next) => {
    try {
      const user = await req.authInformation!.required();

      const todos = await this.prismaClient.todo.findMany({
        where: {
          userId: user.id,
        },
      });

      res.status(200).json(todos);
    } catch (error) {
      next(error);
    }
  };

  private createTodoValidation = object({
    description: string().required(),
    deadline: date().optional().nullable(),
  });

  createTodo: RequestHandler = async (req, res, next) => {
    try {
      const user = await req.authInformation!.required();

      const body = await this.createTodoValidation.validate(req.body);

      const todo = await this.prismaClient.todo.create({
        data: {
          userId: user.id,
          description: body.description,
          deadline: body.deadline,
        },
      });

      res.status(201).json(todo);
    } catch (error) {
      next(error);
    }
  };

  private patchValidation = object({
    description: string().optional(),
    deadline: date().optional().nullable(),
  });

  patch: RequestHandler = async (req, res, next) => {
    try {
      const user = await req.authInformation!.required();

      const todo = await this.getTodoFromParams(req);

      if (!todo || user.id !== todo.userId) {
        return next();
      }

      if (todo.finishedAt) {
        return res.status(409).end();
      }

      const body = await this.patchValidation.validate(req.body);

      return res.status(200).json(
        await this.prismaClient.todo.update({
          where: {
            id: todo.id,
          },
          data: body,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  finish: RequestHandler = async (req, res, next) => {
    try {
      const user = await req.authInformation!.required();

      const todo = await this.getTodoFromParams(req);

      if (!todo || user.id !== todo.userId) {
        return next();
      }

      if (todo.finishedAt) {
        return res.status(409).end();
      }

      return res.status(200).json(
        await this.prismaClient.todo.update({
          where: {
            id: todo.id,
          },
          data: {
            finishedAt: new Date(),
          },
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
