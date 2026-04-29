const pool = require("./db");

async function checkDatabaseConnection() {
  try {
    const result = await pool.query("SELECT current_database() AS database");
    console.log(`Connected to PostgreSQL database: ${result.rows[0].database}`);
  } catch (err) {
    console.error("Database connection failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

checkDatabaseConnection();
