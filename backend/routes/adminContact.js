/**
 * adminContact.js
 * ----------------
 * Admin Contact Info management
 */

const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.get("/contact", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact_info")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Contact info not found." });
    }
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch contact info." });
  }
});

router.put("/contact", async (req, res) => {
  const { whatsapp, instagram, messenger } = req.body;

  try {
    const { error } = await supabase
      .from("contact_info")
      .update({ whatsapp, instagram, messenger })
      .neq("id", 0);

    if (error) throw error;
    res.json({ message: "Contact info updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update contact info." });
  }
});

module.exports = router;
