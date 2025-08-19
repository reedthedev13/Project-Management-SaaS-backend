import request from "supertest";
import { app } from "../app";
import prisma from "../prisma/prismaClient";

describe("Boards API", () => {
  const testUser = {
    name: "Board User",
    email: `boarduser${Date.now()}@example.com`,
    password: "password123",
  };

  let token: string;
  let boardId: number;

  beforeAll(async () => {
    // Register and login user
    await request(app).post("/api/auth/register").send(testUser);
    const loginRes = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = loginRes.body.token;
  });

  afterAll(async () => {
    await prisma.board.deleteMany();
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("should create a new board", async () => {
    const res = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Board" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.title).toBe("Test Board");
    boardId = res.body.id;
  });

  it("should fetch boards for the user", async () => {
    const res = await request(app)
      .get("/api/boards")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should update the board title", async () => {
    const res = await request(app)
      .put(`/api/boards/${boardId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Board" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Board");
  });

  it("should delete the board", async () => {
    const res = await request(app)
      .delete(`/api/boards/${boardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(204);
  });
});
