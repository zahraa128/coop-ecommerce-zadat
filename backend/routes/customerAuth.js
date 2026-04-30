const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

/* ===== REGISTER ===== */
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
    const { data: existing, error: existingError } = await supabase
      .from("customers")
      .select("id")
      .eq("email", email)
      .limit(1);

    if (existingError) throw existingError;

    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const { error } = await supabase
      .from("customers")
      .insert([{
        full_name,
        phone,
        email,
        address,
        password
      }]);

    if (error) throw error;

    res.json({ message: "Registration successful" });

  } catch (err) {
    console.error("REGISTER ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===== LOGIN ===== */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const { data, error } = await supabase
      .from("customers")
      .select("id, full_name")
      .eq("email", email)
      .eq("password", password)
      .limit(1);

    if (error) throw error;

    if (!data || data.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      customer_id: data[0].id,
      customer_name: data[0].full_name
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;