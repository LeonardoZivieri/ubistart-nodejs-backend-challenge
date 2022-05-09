import { User } from "@prisma/client";
import { randomBytes } from "crypto";
import databaseUserPasswordHasher from "./databaseUserPasswordHasher";

export default function databaseUserPasswordRegister(password: string) {
  const salt = randomBytes(16).toString("hex");
  password = databaseUserPasswordHasher(password, salt);
  return {
    saltUp: new Date(),
    password,
    salt,
  } as Pick<User, "saltUp" | "password" | "salt">;
}
