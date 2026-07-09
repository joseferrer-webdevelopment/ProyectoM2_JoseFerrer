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

module.exports = { getAllPosts, getAllPostsById, getPostsByAuthorId };
