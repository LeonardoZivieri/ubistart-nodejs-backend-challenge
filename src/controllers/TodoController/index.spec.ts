/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import { randomUUID } from "crypto";
import request from "supertest";
import { AppPrismaClient } from "../../lib/AppPrismaClient";
import server from "../../server";

describe("Test TodoController", () => {
  let controller: Express.Application = server;
  let testHash = randomUUID();

  let prisma: AppPrismaClient;
  beforeAll(() => {
    prisma = new AppPrismaClient();
  });

  let testUserToken = (async () => {
    const response = await request(controller)
      .post("/auth/register")
      .type("json")
      .send(
        JSON.stringify({
          email: `todo-tester-${testHash}@test.com`,
          password: "strongP4$$word",
        })
      )
      .expect(201);

    const token = response.body?.auth?.token;

    expect(token).toBeTruthy();

    return token;
  })();

  it("should list todos of user", async () => {
    const userToken = await testUserToken;
    const response = await request(controller)
      .get("/todo")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.constructor.name).toBe("Array");
  });

  it("should not list todos without a user", async () => {
    await request(controller).get("/todo").expect(401);
  });

  it("should create a todo with deadline", async () => {
    const todo = {
      description: "should create a todo with deadline",
      deadline: new Date().toJSON(),
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);
  });

  it("should create a todo without deadline", async () => {
    const todo = {
      description: "should create a todo with deadline",
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(null);
  });

  it("should update deadline to other date", async () => {
    const todo = {
      description: "should update deadline to other date",
      deadline: new Date().toJSON(),
    };
    const toUpdateTodo = {
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toJSON(),
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);

    const updateResponse = await request(controller)
      .patch("/todo/" + response.body.id)
      .type("json")
      .send(JSON.stringify(toUpdateTodo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(new Date(updateResponse.body.deadline).toJSON()).toBe(
      toUpdateTodo.deadline
    );
  });

  it("should update deadline to null", async () => {
    const todo = {
      description: "should update deadline to other date",
      deadline: new Date().toJSON(),
    };
    const toUpdateTodo = {
      deadline: null,
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);

    const updateResponse = await request(controller)
      .patch("/todo/" + response.body.id)
      .type("json")
      .send(JSON.stringify(toUpdateTodo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(updateResponse.body.deadline).toEqual(toUpdateTodo.deadline);
  });

  it("should finish a todo item", async () => {
    const todo = {
      description: "should update deadline to other date",
      deadline: new Date().toJSON(),
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);

    const updateResponse = await request(controller)
      .post("/todo/" + response.body.id + "/finish")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(updateResponse.body.finishedAt).not.toBe(null);
  });

  it("should not finish a finished todo item", async () => {
    const todo = {
      description: "should update deadline to other date",
      deadline: new Date().toJSON(),
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);

    const updateResponse = await request(controller)
      .post("/todo/" + response.body.id + "/finish")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    expect(updateResponse.body.finishedAt).not.toBe(null);

    await request(controller)
      .post("/todo/" + response.body.id + "/finish")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(409);
  });

  it("should not update a finished todo item", async () => {
    const todo = {
      description: "should not update a finished todo item",
      deadline: new Date().toJSON(),
    };
    const toUpdateTodo = {
      deadline: null,
    };

    const userToken = await testUserToken;
    const response = await request(controller)
      .post("/todo")
      .type("json")
      .send(JSON.stringify(todo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(201);

    expect(response.body.description).toEqual(todo.description);
    expect(response.body.deadline).toEqual(todo.deadline);

    await request(controller)
      .post("/todo/" + response.body.id + "/finish")
      .set("Authorization", `Bearer ${userToken}`)
      .expect(200);

    await request(controller)
      .patch("/todo/" + response.body.id)
      .type("json")
      .send(JSON.stringify(toUpdateTodo))
      .set("Authorization", `Bearer ${userToken}`)
      .expect(409);
  });
});
