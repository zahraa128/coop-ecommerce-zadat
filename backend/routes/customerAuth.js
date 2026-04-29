const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/register", async (req, res) => {
  const {
    full_name,
    phone,
    email,
    address,
    password,
    confirm_password
  } = req.body;

  if (!full_name || !phone || !email || !address || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  if (confirm_password !== undefined && password !== confirm_password) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    const existing = await pool.query("SELECT c_id FROM customers WHERE email = $1 LIMIT 1", [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    await pool.query(
      `INSERT INTO customers (full_name, phone, email, address, password)
       VALUES ($1, $2, $3, $4, $5)`,
      [full_name, phone, email, address, password]
    );

    res.json({ message: "Registration successful" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const result = await pool.query(
      "SELECT c_id, full_name FROM customers WHERE email = $1 AND password = $2 LIMIT 1",
      [email, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      customer_id: result.rows[0].c_id,
      customer_name: result.rows[0].full_name
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
