"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
const prismaClient_1 = __importDefault(require("../prisma/prismaClient"));
describe("Boards API", () => {
    const testUser = {
        name: "Board User",
        email: `boarduser${Date.now()}@example.com`,
        password: "password123",
    };
    let token;
    let boardId;
    beforeAll(async () => {
        // Register and login user
        await (0, supertest_1.default)(app_1.app).post("/api/auth/register").send(testUser);
        const loginRes = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        token = loginRes.body.token;
    });
    afterAll(async () => {
        await prismaClient_1.default.board.deleteMany();
        await prismaClient_1.default.user.deleteMany({ where: { email: testUser.email } });
        await prismaClient_1.default.$disconnect();
    });
    it("should create a new board", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Test Board" });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty("id");
        expect(res.body.title).toBe("Test Board");
        boardId = res.body.id;
    });
    it("should fetch boards for the user", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .get("/api/boards")
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
    it("should update the board title", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .put(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Updated Board" });
        expect(res.statusCode).toBe(200);
        expect(res.body.title).toBe("Updated Board");
    });
    it("should delete the board", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .delete(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });
});
// ---------------- Validation Tests ----------------
describe("Boards API Validation", () => {
    let token;
    beforeAll(async () => {
        const testUser = {
            name: "Validation Board User",
            email: `validationboarduser${Date.now()}@example.com`,
            password: "password123",
        };
        await (0, supertest_1.default)(app_1.app).post("/api/auth/register").send(testUser);
        const loginRes = await (0, supertest_1.default)(app_1.app).post("/api/auth/login").send({
            email: testUser.email,
            password: testUser.password,
        });
        token = loginRes.body.token;
    });
    afterAll(async () => {
        await prismaClient_1.default.board.deleteMany();
        await prismaClient_1.default.user.deleteMany({
            where: { email: { contains: "validationboarduser" } },
        });
        await prismaClient_1.default.$disconnect();
    });
    it("should reject creating a board without title", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should reject updating a board without a title", async () => {
        // First create a valid board
        const boardRes = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Valid Board" });
        const boardId = boardRes.body.id;
        const res = await (0, supertest_1.default)(app_1.app)
            .put(`/api/boards/${boardId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty("error");
    });
    it("should create a board successfully with valid input", async () => {
        const res = await (0, supertest_1.default)(app_1.app)
            .post("/api/boards")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "Another Valid Board" });
        expect(res.statusCode).toBe(201);
        expect(res.body.title).toBe("Another Valid Board");
    });
});
