const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const supabase = require("../supabase");

// POST /api/admin/auth/login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .single();

    if (error || !data) {
      return res.status(401).json({ message: "Invalid username" });
    }

    const match = await bcrypt.compare(password, data.password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: data.id, username: data.username },
      "SECRET_KEY_123",
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
      user: {
        id: data.id,
        username: data.username
      }
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
