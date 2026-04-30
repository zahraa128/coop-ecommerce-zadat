
const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    const { error } = await supabase
      .from("admins")
      .insert({ username, password });

    if (error) throw error;
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("username", username)
      .eq("password", password)
      .limit(1);

    if (error) throw error;

    if (data.length === 1) {
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
