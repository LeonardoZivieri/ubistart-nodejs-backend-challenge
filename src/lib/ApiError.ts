import { PrismaClient } from "@prisma/client";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}
