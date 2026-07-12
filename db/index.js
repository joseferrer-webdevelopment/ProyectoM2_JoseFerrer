const { Pool } = require("pg");
require("dotenv").config();

const dbConnectionLocal = {
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
}

const dbConnectionProduction = {
  connectionString: process.env.DATABASE_URL
}

const pool = new Pool( process.env.DATABASE_URL ? dbConnectionProduction : dbConnectionLocal)

module.exports = pool;




