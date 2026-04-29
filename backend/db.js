const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "..", ".env") });

const pool = new Pool({
  host: process.env.SUPABASE_DB_HOST || process.env.DB_HOST,
  user: process.env.SUPABASE_DB_USER || process.env.DB_USER,
  password: process.env.SUPABASE_DB_PASSWORD || process.env.DB_PASSWORD,
  database: process.env.SUPABASE_DB_NAME || process.env.DB_NAME || "postgres",
  port: Number(process.env.SUPABASE_DB_PORT || process.env.DB_PORT || 5432),
  ssl: {
    rejectUnauthorized: false
  }
});

pool
  .query("SELECT 1")
  .then(() => console.log("Connected to Supabase PostgreSQL"))
  .catch(err => console.error("PostgreSQL connection failed:", err.message));

module.exports = pool;