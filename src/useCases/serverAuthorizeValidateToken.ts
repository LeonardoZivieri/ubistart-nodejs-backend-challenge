import { prisma, User } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";
import jsonwebtoken from "jsonwebtoken";
import { AppPrismaClient } from "../lib/AppPrismaClient";
import serverEnvironment from "./serverEnvironment";

export default async function serverAuthorizeValidateRefreshToken(
  token: string,
  appPrismaClient: AppPrismaClient
): Promise<User | null> {
  const env = serverEnvironment();

  try {
    const verified = jsonwebtoken.verify(
      token,
      env.APP_AUTH_ACCESS_TOKEN_SECRET
    );

    if (typeof verified != "string") {
      return appPrismaClient.user.findFirst({
        where: {
          id: verified.uid,
        },
      });
    }
  } catch (error) {}

  return null;
}
