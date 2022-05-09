/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { PrismaClient } from "@prisma/client";
import databaseUserPasswordRegister from "../useCases/databaseUserPasswordRegister";
import { AppPrismaClient } from "./AppPrismaClient";

describe("Test AppPrismaClient", () => {
  let prisma: AppPrismaClient;
  beforeAll(() => {
    prisma = new AppPrismaClient();
  });

  it("should begin empty and save new records", async () => {
    expect(await prisma.user.count()).toBe(0);
    expect(
      await prisma.user.create({
        data: {
          email: "test@email.com",
          ...databaseUserPasswordRegister("strongP4$$word"),
        },
      })
    ).not.toBeNull();
    expect(await prisma.user.count()).toBe(1);
  });
});
