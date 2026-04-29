/**
 * createTables.js
 * ----------------
 * This file creates all database tables for the e-commerce project.
 * It should be run ONLY ONCE after creating the database.
 */

const db = require("./connect"); // MySQL connection

// ADMIN TABLE
const adminTable = `
CREATE TABLE IF NOT EXISTS admin (
  A_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
)
`;

db.query(adminTable, (err) => {
  if (err) console.error("❌ admin table failed:", err.message);
  else console.log("✅ admin table created");
});

// CATEGORIES TABLE
const categoriesTable = `
CREATE TABLE IF NOT EXISTS categories (
  ca_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL
)
`;

db.query(categoriesTable, (err) => {
  if (err) console.error("❌ categories table failed:", err.message);
  else console.log("✅ categories table created");
});

// PRODUCTS TABLE
const productsTable = `
CREATE TABLE IF NOT EXISTS products (
  p_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  image VARCHAR(255),
  price DECIMAL(10,2),
  category VARCHAR(100),
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(ca_id)
  ON DELETE SET NULL
)
`;

db.query(productsTable, (err) => {
  if (err) console.error("❌ products table failed:", err.message);
  else console.log("✅ products table created");
});

// CUSTOMERS TABLE
const customersTable = `
CREATE TABLE IF NOT EXISTS customers (
  c_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(100),
  address VARCHAR(255),
  password VARCHAR(255)
)
`;

db.query(customersTable, (err) => {
  if (err) console.error("❌ customers table failed:", err.message);
  else console.log("✅ customers table created");
});

// ORDERS TABLE
const ordersTable = `
CREATE TABLE IF NOT EXISTS orders (
  o_id INT AUTO_INCREMENT PRIMARY KEY,
  customers_id INT,
  product_id INT,
  quantity INT,
  order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  status VARCHAR(20) DEFAULT 'submitted',
  FOREIGN KEY (customers_id) REFERENCES customers(c_id),
  FOREIGN KEY (product_id) REFERENCES products(p_id)
)
`;

db.query(ordersTable, (err) => {
  if (err) console.error("❌ orders table failed:", err.message);
  else console.log("✅ orders table created");
});

// CONTACT INFO TABLE
const contactInfoTable = `
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  whatsapp VARCHAR(255),
  instagram VARCHAR(255),
  messenger VARCHAR(255)
)
`;

db.query(contactInfoTable, (err) => {
  if (err) console.error("❌ contact_info table failed:", err.message);
  else console.log("✅ contact_info table created");
});

// ABOUT PAGE TABLE
const aboutPageTable = `
CREATE TABLE IF NOT EXISTS about_page (
  id INT AUTO_INCREMENT PRIMARY KEY,
  content TEXT NOT NULL
)
`;

db.query(aboutPageTable, (err) => {
  if (err) console.error("❌ about_page table failed:", err.message);
  else console.log("✅ about_page table created");
});

// Close DB connection after all queries
setTimeout(() => {
  db.end();
  console.log("All tables setup complete");
}, 1000);
