const request = require("supertest");
const app = require("../app");
const pool = require("../db");

describe("post /posts", () => {
  it("debería crear un post nuevo con status 201", async () => {
    const nuevoPost = {
      authorId: "1",
      title: "SuperTestPost",
      content: "SuperTest post",
      published: true,
    };

    const response = await request(app).post("/posts").send(nuevoPost);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.title).toBe(nuevoPost.title);
  });
});

afterAll(async () => {
  await pool.end();
});
