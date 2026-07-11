const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("GET /authors", () => {
  it("debería devolver status 200 y un array", async () => {
    const response = await request(app).get("/authors");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});

describe("GET /authors/:id", () => {
  it("debería devolver un author específico con status 200", async () => {
    const response = await request(app).get("/authors/1");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("name");
    expect(response.body).toHaveProperty("email");
  });

  it("debería devolver 404 si el author no existe", async () => {
    const response = await request(app).get("/authors/9999");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Author no encontrado");
  });
});

afterAll(async () => {
  await pool.end();
});
