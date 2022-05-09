/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { randomUUID } from "crypto";
import request from "supertest";
import { AppPrismaClient } from "../../lib/AppPrismaClient";
import server from "../../server";

describe("Test AuthController", () => {
  let controller: Express.Application = server;
  let testHash = randomUUID();

  let prisma: AppPrismaClient;
  beforeAll(() => {
    prisma = new AppPrismaClient();
  });

  it("should create an user and return the user data and token", async () => {
    const response = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-create-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    expect(response.body.user).toBeDefined();
    expect(response.body.auth).toBeDefined();
    expect(response.body.auth.token).toBeTruthy();

    const userIsInDatabase = await prisma.user.count({
      where: {
        email: `should-create-${testHash}@test.com`,
      },
    });

    expect(userIsInDatabase).toBe(1);
  });

  it("should not create an user without valid email", async () => {
    await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          password: "strongP4$$word",
        })
      )
      .expect(400);
  });

  it("should not create two users with same email", async () => {
    const response = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-be-unique-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    expect(response.body.user).toBeDefined();
    expect(response.body.auth).toBeDefined();
    expect(response.body.auth.token).toBeTruthy();

    await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-be-unique-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(409);
  });

  it("should not create an user without password", async () => {
    await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-error-no-password-${testHash}@test.com`,
        })
      )
      .expect(400);
  });

  it("should return a jwt token when login", async () => {
    const creation = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-login-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    expect(creation.body.user).toBeDefined();
    expect(creation.body.auth).toBeDefined();
    expect(creation.body.auth.token).toBeTruthy();

    const authentication = await request(controller)
      .post("/auth/authenticate")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-login-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(200);

    expect(authentication.body.user).toBeDefined();
    expect(authentication.body.auth).toBeDefined();
    expect(authentication.body.auth.token).toBeTruthy();
  });

  it("should show a 401 error when send a invalid login", async () => {
    const creation = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-login-error-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    expect(creation.body.user).toBeDefined();
    expect(creation.body.auth).toBeDefined();
    expect(creation.body.auth.token).toBeTruthy();

    await request(controller)
      .post("/auth/authenticate")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-login-error-${testHash}@test.com`,
          password: "opsthisisnotthepass",
        })
      )
      .expect(401);
  });

  it("should refresh a jwt token", async () => {
    const creation = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `should-refresh-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    expect(creation.body.user).toBeDefined();
    expect(creation.body.auth).toBeDefined();
    expect(creation.body.auth.token).toBeTruthy();

    const refresh = await request(controller)
      .post("/auth/refresh-token")
      .type("json")
      .send(
        JSON.stringify({
          token: `${creation.body.auth.refreshToken}`,
        })
      )
      .expect(200);

    expect(refresh.body.user).toBeDefined();
    expect(refresh.body.auth).toBeDefined();
    expect(refresh.body.auth.token).toBeTruthy();

    expect(refresh.body.auth.token).not.toBe(creation.body.auth.token);
  });

  // it("should return a 401 error when trying to refresh a invalid token", async () => {
  //   const creation = await request(controller)
  //     .post("/auth/register")
  //     .type("json")
  //     .send(
  //       JSON.stringify({
  //         email: `should-not-refresh-invalid-${testHash}@test.com`,
  //         password: "strongP4$$word",
  //       })
  //     )
  //     .expect(201);

  //   expect(creation.body.user).toBeDefined();
  //   expect(creation.body.auth).toBeDefined();
  //   expect(creation.body.auth.token).toBeTruthy();

  //   const refresh = await request(controller)
  //     .post("/auth/refresh-token")
  //     .type("json")
  //     .send(
  //       JSON.stringify({
  //         token: creation.body.auth.refreshToken,
  //       })
  //     )
  //     .expect(201);

  //   expect(refresh.body.user).toBeDefined();
  //   expect(refresh.body.auth).toBeDefined();
  //   expect(refresh.body.auth.token).toBeTruthy();
  // });
});
