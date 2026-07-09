const pool = require('../db');

async function getAllPosts() {
    const result = await pool.query('SELECT * FROM posts ORDER BY id');
    return result.rows;
}

async function getAllPostsById(id) {
    const result = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    return result.rows[0];
}

module.exports = {getAllPosts, getAllPostsById}