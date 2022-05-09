/**
 * @jest-environment ./prisma/prisma-environment-jest
 */

import request from "supertest";
import server from "../../server";

describe("Test AuthController", () => {
  let controller: Express.Application = server;

  it("should show a hello message", async () => {
    await request(controller).get("/hello").expect(200);
  });
});
