declare namespace Express {
  export interface Request {
    authInformation?: {
      required(): Promise<void>;
      validate(): Promise<User>;
    };
  }
}
