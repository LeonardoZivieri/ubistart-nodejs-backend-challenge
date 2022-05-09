import { User } from "@prisma/client";
import { pbkdf2Sync, randomBytes } from "crypto";

export default function databaseUserPasswordHasher(
  password: string,
  salt: string
) {
  return pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString();
}
