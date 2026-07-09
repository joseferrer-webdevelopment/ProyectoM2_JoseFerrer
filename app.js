require('dotenv').config();
const express = require('express');
const pool = require('./db');
const authorsRoutes = require('./routes/authors.routes');
const postsRoutes = require('./routes/posts.routes');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API MiniBlog funcionando' });
});

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ conectado: true, hora: result.rows[0] });
  } catch (error) {
    res.status(500).json({ conectado: false, error: error.message });
  }
});

app.use('/authors', authorsRoutes);
app.use('/posts', postsRoutes);

module.exports = app;