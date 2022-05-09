import { PrismaClient } from "@prisma/client";

export class AppPrismaClient extends PrismaClient {
  constructor() {
    super({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }
}
