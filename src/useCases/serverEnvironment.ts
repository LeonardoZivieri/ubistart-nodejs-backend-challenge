export type ServerEnvironment = {
  APP_AUTH_ACCESS_TOKEN_SECRET: string;
  APP_AUTH_ACCESS_TOKEN_EXPIRATION: number;
  APP_AUTH_REFRESH_TOKEN_SECRET: string;
  APP_AUTH_REFRESH_TOKEN_EXPIRATION: number;
};

export default function serverEnvironment(): ServerEnvironment {
  const env = {
    APP_AUTH_ACCESS_TOKEN_SECRET: process.env.APP_AUTH_ACCESS_TOKEN_SECRET,
    APP_AUTH_ACCESS_TOKEN_EXPIRATION: +(
      process.env.APP_AUTH_ACCESS_TOKEN_EXPIRATION || "30"
    ),
    APP_AUTH_REFRESH_TOKEN_SECRET: process.env.APP_AUTH_REFRESH_TOKEN_SECRET,
    APP_AUTH_REFRESH_TOKEN_EXPIRATION: +(
      process.env.APP_AUTH_REFRESH_TOKEN_EXPIRATION || "30"
    ),
  };

  if (!env.APP_AUTH_ACCESS_TOKEN_SECRET || !env.APP_AUTH_REFRESH_TOKEN_SECRET) {
    if (
      process.env.NODE_ENV &&
      ["test", "development"].includes(process.env.NODE_ENV)
    ) {
      env.APP_AUTH_ACCESS_TOKEN_SECRET =
        "APP_AUTH_ACCESS_TOKEN_SECRET_DEBUG_" + process.env.NODE_ENV;
      env.APP_AUTH_REFRESH_TOKEN_SECRET =
        "APP_AUTH_REFRESH_TOKEN_SECRET_DEBUG_" + process.env.NODE_ENV;
    } else {
      throw new Error("You need to create the auth secrets");
    }
  }

  return env as ServerEnvironment;
}
