const pool = require("./db");

async function createSchema() {
  const statements = [
    `CREATE TABLE IF NOT EXISTS admins (
      a_id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS categories (
      ca_id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS products (
      p_id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      description TEXT,
      image VARCHAR(255),
      price NUMERIC(10, 2),
      category VARCHAR(100),
      category_id INTEGER REFERENCES categories(ca_id) ON DELETE SET NULL
    )`,
    `CREATE TABLE IF NOT EXISTS customers (
      c_id SERIAL PRIMARY KEY,
      full_name VARCHAR(100),
      phone VARCHAR(20),
      email VARCHAR(100) UNIQUE,
      address VARCHAR(255),
      password VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS orders (
      o_id SERIAL PRIMARY KEY,
      customers_id INTEGER REFERENCES customers(c_id),
      product_id INTEGER REFERENCES products(p_id),
      quantity INTEGER,
      order_date TIMESTAMP DEFAULT NOW(),
      status VARCHAR(20) DEFAULT 'submitted'
    )`,
    `CREATE TABLE IF NOT EXISTS contact_info (
      id SERIAL PRIMARY KEY,
      whatsapp VARCHAR(255),
      instagram VARCHAR(255),
      messenger VARCHAR(255)
    )`,
    `CREATE TABLE IF NOT EXISTS about_page (
      id SERIAL PRIMARY KEY,
      content TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS visits (
      id SERIAL PRIMARY KEY,
      visit_date DATE NOT NULL DEFAULT CURRENT_DATE
    )`
  ];

  try {
    for (const statement of statements) {
      await pool.query(statement);
    }
    console.log("PostgreSQL tables are ready");
  } catch (err) {
    console.error("Failed to create PostgreSQL tables:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createSchema();