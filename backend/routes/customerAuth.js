const express = require("express");
const db = require("../connect");

const router = express.Router();

// CUSTOMER REGISTER
router.post("/register", (req, res) => {
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

  db.query(
    "SELECT c_id FROM customers WHERE email = ? LIMIT 1",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length > 0) {
        return res.status(400).json({ message: "Email already registered" });
      }

      db.query(
        "INSERT INTO customers (full_name, phone, email, address, password) VALUES (?, ?, ?, ?, ?)",
        [full_name, phone, email, address, password],
        err2 => {
          if (err2) {
            return res.status(500).json({ message: "Server error" });
          }
          res.json({ message: "Registration successful" });
        }
      );
    }
  );
});

// CUSTOMER LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  db.query(
    "SELECT c_id, full_name FROM customers WHERE email = ? AND password = ? LIMIT 1",
    [email, password],
    (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Server error" });
      }

      if (results.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      res.json({
        message: "Login successful",
        customer_id: results[0].c_id,
        customer_name: results[0].full_name
      });
    }
  );
});

module.exports = router;
