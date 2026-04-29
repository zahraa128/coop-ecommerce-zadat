const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    await pool.query("INSERT INTO admins (username, password) VALUES ($1, $2)", [username, password]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query(
      "SELECT * FROM admins WHERE username = $1 AND password = $2 LIMIT 1",
      [username, password]
    );

    if (result.rows.length === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
