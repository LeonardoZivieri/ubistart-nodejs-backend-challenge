import { User } from "@prisma/client";
import databaseUserPasswordHasher from "./databaseUserPasswordHasher";

export default function databaseUserPasswordValidator(
  user: User,
  passwordToCheck: string
): boolean {
  return user.password == databaseUserPasswordHasher(passwordToCheck, user.salt);
}
