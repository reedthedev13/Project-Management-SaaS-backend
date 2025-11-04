"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: ".env" });
describe("Tasks API", () => {
    const testUser = {
        name: "Task User",
        email: `taskuser${Date.now()}@example.com`,
        password: "password123",
    };
    let token;
    let boardId;
    let taskId;
    beforeAll(async () => {
        // Register user
        await (0, supertest_1.default)(app_1.app).post("/api/auth/register").send(testUser);
        // Login user
        const loginRes = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        console.log("Login response:", loginRes.body);
        token = loginRes.body.token;
        if (!token)
            throw new Error("Login failed: token not returned");
        // Create board
        const boardRes = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Task Board" });
        boardId = boardRes.body.id;
        if (!boardId)
            throw new Error("Board creation failed");
        // Create one initial task to ensure fetch works
        const taskRes = await (0, supertest_1.default)(app_1.app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Initial Task", boardId });
        taskId = taskRes.body.id;
        if (!taskId)
            throw new Error("Initial task creation failed");
    });
    afterAll(async () => {
        await prismaClient_1.default.task.deleteMany();
        await prismaClient_1.default.board.deleteMany();
        await prismaClient_1.default.user.deleteMany({ where: { email: testUser.email } });
        await prismaClient_1.default.$disconnect();
    });
    it("should create a new task", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post(`/api/tasks`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Task", boardId });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe("Test Task");
        taskId = res.body.id;
    });
    it("should fetch tasks by board", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .get(`/api/tasks?boardId=${boardId}`)
            .set("Authorization", `Bearer ${token}`);
        console.log("Fetch tasks response:", res.body);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    it("should update a task", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .put(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Task", status: "in-progress" });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Updated Task");
        expect(res.body.status).toBe("in-progress");
    });
    it("should delete a task", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Task deleted");
    });
});
// ---------------- Validation Tests ----------------
describe("Tasks API Validation", () => {
    let token;
    let boardId;
    beforeAll(async () => {
        const testUser = {
            name: "Validation User",
            email: `validationuser${Date.now()}@example.com`,
            password: "password123",
        };
        // Register and login user
        await (0, supertest_1.default)(app_1.app).post("/api/auth/register").send(testUser);
        const loginRes = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        token = loginRes.body.token;
        // Create a board
        const boardRes = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Validation Board" });
        boardId = boardRes.body.id;
    });
    afterAll(async () => {
        await prismaClient_1.default.task.deleteMany();
        await prismaClient_1.default.board.deleteMany();
        await prismaClient_1.default.user.deleteMany({
            where: { email: { contains: "validationuser" } },
        });
        await prismaClient_1.default.$disconnect();
    });
    it("should reject creating a task without title", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ boardId });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should reject creating a task with invalid boardId", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Invalid Task", boardId: "not-a-number" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should reject updating a task with invalid status", async () => {
        const taskRes = await (0, supertest_1.default)(app_1.app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Valid Task", boardId });
        const taskId = taskRes.body.id;
        const res = await (0, supertest_1.default)(app_1.app)
            .put(`/api/tasks/${taskId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ status: "not-a-valid-status" });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should create a task successfully with valid input", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/tasks")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Valid Task", boardId });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("Valid Task");
    });
});
