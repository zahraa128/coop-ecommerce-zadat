const express = require("express");
const router = express.Router();
const db = require("../connect");


/* =========================
   REGISTER (optional)
   ========================= */
router.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  const sql = "INSERT INTO admin (username, password) VALUES (?, ?)";

  db.query(sql, [username, password], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true });
  });
});

/* =========================
   LOGIN
   ========================= */
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM admin WHERE username = ? AND password = ?";

  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }

    if (results.length === 1) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  });
});

module.exports = router;
