import { User } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";
import jsonwebtoken from "jsonwebtoken";
import serverEnvironment from "./serverEnvironment";

export type AuthToken = {
  token: string;
  expToken: number;
  refreshToken: string;
  expRefreshToken: number;
};

export default function serverAuthorizeUserGetToken(user: User): AuthToken {
  const env = serverEnvironment();
  const token = jsonwebtoken.sign(
    {
      uid: user.id,
      email: user.email,
      exp: Date.now() + env.APP_AUTH_ACCESS_TOKEN_EXPIRATION,
    },
    env.APP_AUTH_ACCESS_TOKEN_SECRET
  );
  const refreshToken = jsonwebtoken.sign(
    {
      uid: user.id,
      email: user.email,
      exp: Date.now() + env.APP_AUTH_REFRESH_TOKEN_EXPIRATION,
    },
    env.APP_AUTH_REFRESH_TOKEN_SECRET
  );

  return {
    token,
    expToken: env.APP_AUTH_ACCESS_TOKEN_EXPIRATION,
    refreshToken,
    expRefreshToken: env.APP_AUTH_ACCESS_TOKEN_EXPIRATION,
  };
}
