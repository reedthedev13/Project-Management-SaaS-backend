import request from "supertest";
import { app } from "../app";
import prisma from "../prisma/prismaClient";

describe("Tasks API", () => {
  const testUser = {
    name: "Task User",
    email: `taskuser${Date.now()}@example.com`,
    password: "password123",
  };

  let token: string;
  let boardId: number;
  let taskId: number;

  beforeAll(async () => {
    // Register/login user and create a board
    await request(app).post("/api/auth/register").send(testUser);
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    token = res.body.token;

    const boardRes = await request(app)
      .post("/api/boards")
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Task Board" });
    boardId = boardRes.body.id;
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.board.deleteMany();
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it("should create a new task", async () => {
    const res = await request(app)
      .post(`/api/tasks`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Test Task", boardId });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body).toHaveProperty("title", "Test Task");
    taskId = res.body.id;
  });

  it("should fetch tasks by board", async () => {
    const res = await request(app)
      .get(`/api/tasks?boardId=${boardId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it("should update a task", async () => {
    const res = await request(app)
      .put(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({ title: "Updated Task", status: "in-progress" });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
  });

  it("should delete a task", async () => {
    const res = await request(app)
      .delete(`/api/tasks/${taskId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
  });
});
