const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /api/admin/auth/login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1 AND password = $2 LIMIT 1",
      [username, password]
    );

    if (result.rows.length >= 1) {
      res.json({ success: true, username: result.rows[0].username });
    } else {
      res.json({ success: false, message: "Invalid username or password" });
    }
  } catch (err) {
    console.error("DB error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;