const pool = require("../db");

async function getAllPosts() {
  const result = await pool.query("SELECT * FROM posts ORDER BY id");
  return result.rows;
}

async function getAllPostsById(id) {
  const result = await pool.query("SELECT * FROM posts WHERE id = $1", [id]);
  return result.rows[0];
}

async function getPostsByAuthorId(authorId) {
  const result = await pool.query(
    `SELECT posts.*, authors.name AS author_name, authors.email AS author_email
     FROM posts
     JOIN authors ON posts.author_id = authors.id
     WHERE posts.author_id = $1`,
    [authorId],
  );
  return result.rows;
}

async function createPost(authorId, title, content, published) {
  const result = await pool.query(
    "INSERT INTO posts (author_id, title, content, published) VALUES ($1, $2, $3, $4) RETURNING *",
    [authorId, title, content, published],
  );
  return result.rows[0];
}

async function updatePosts(id, title, content, published) {
  const result = await pool.query(
    "UPDATE posts SET title = $1, content = $2, published = $3 WHERE id = $4 RETURNING *",
    [title, content, published, id],
  );
  return result.rows[0];
}

async function deletePostById(id) {
  const result = await pool.query(
    "DELETE FROM posts WHERE id = $1 RETURNING *",
    [id],
  );
  return result.rows[0];
}

module.exports = {
  getAllPosts,
  getAllPostsById,
  getPostsByAuthorId,
  createPost,
  updatePosts,
  deletePostById
};
