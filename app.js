require('dotenv').config();
const express = require('express');
const pool = require('./db');
const authorsRoutes = require('./routes/authors.routes');
const postsRoutes = require('./routes/posts.routes');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./openapi.yaml');

// Se sobrescribe dinámicamente la URL del servidor en Swagger según el entorno:
// si existe DATABASE_URL (Railway/producción), muestra la URL pública;
// si no existe (desarrollo local), muestra localhost.
// Esto evita mantener 2 URLs fijas en el archivo openapi.yaml y reutiliza
// el mismo criterio de detección de entorno que ya usa db/index.js.

swaggerDocument.servers = process.env.DATABASE_URL
  ? [{ url: 'https://proyectom2joseferrer-production.up.railway.app', description: 'Servidor en producción (Railway)' }]
  : [{ url: 'http://localhost:3000', description: 'Servidor local de desarrollo' }];

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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = app;