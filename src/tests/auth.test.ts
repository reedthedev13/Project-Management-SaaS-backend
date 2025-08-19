import request from "supertest";
import { app } from "../app";

describe("Auth API", () => {
  const testUser = {
    name: "Test User",
    email: `testuser${Date.now()}@example.com`,
    password: "password123",
  };

  let token: string;

  // ----------------- Validation Tests -----------------
  it("should reject registration with invalid email", async () => {
    const res = await request(app).post("/api/auth/register").send({
      name: "Bad Email",
      email: "not-an-email",
      password: "password123",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  it("should reject registration with short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        name: "Short Password",
        email: `shortpass${Date.now()}@example.com`,
        password: "123",
      });
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  // ----------------- Existing Tests -----------------
  it("should register a new user", async () => {
    const res = await request(app).post("/api/auth/register").send(testUser);
    console.log(res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("user.id");
    expect(res.body).toHaveProperty("user.email", testUser.email);
  });

  it("should login and return a token", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    token = res.body.token;
  });

  it("should return current user data with valid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email", testUser.email);
  });

  it("should reject invalid token", async () => {
    const res = await request(app)
      .get("/api/auth/me")
      .set("Authorization", "Bearer invalidtoken");
    expect(res.statusCode).toBe(401);
  });
});
