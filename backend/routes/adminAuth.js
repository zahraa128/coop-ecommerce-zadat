// backend/routes/adminAuth.js
const express = require("express");
const router = express.Router();
const db = require("../connect");

// POST /api/admin/auth/login
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("DB error:", err);
      return res.status(500).json({ success: false, message: "Server error" });
    }

    if (results.length >= 1) {
      // Valid login
      res.json({ success: true, username: results[0].username });
    } else {
      // Wrong username / password
      res.json({ success: false, message: "Invalid username or password" });
    }
  });
});

module.exports = router;
