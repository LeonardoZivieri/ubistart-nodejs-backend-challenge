declare namespace NodeJS {
  export interface ProcessEnv {
    APP_AUTH_ACCESS_TOKEN_SECRET: string;
    APP_AUTH_ACCESS_TOKEN_EXPIRATION: number;

    APP_AUTH_REFRESH_TOKEN_SECRET: string;
    APP_AUTH_REFRESH_TOKEN_EXPIRATION: number;
  }
}
