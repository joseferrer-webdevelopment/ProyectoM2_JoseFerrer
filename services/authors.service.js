const pool = require('../db');

async function getAllAuthors() {
    const result = await pool.query('SELECT * FROM  authors ORDER BY id');
    return result.rows;
    
}

module.exports = { getAllAuthors}