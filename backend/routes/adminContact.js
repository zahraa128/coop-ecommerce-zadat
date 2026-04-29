/**
 * adminContact.js
 * ----------------
 * Admin Contact Info management
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/admin/contact", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM contact_info LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Contact info not found." });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to fetch contact info." });
  }
});

router.put("/admin/contact", async (req, res) => {
  const { whatsapp, instagram, messenger } = req.body;

  try {
    await pool.query(
      "UPDATE contact_info SET whatsapp = $1, instagram = $2, messenger = $3",
      [whatsapp, instagram, messenger]
    );
    res.json({ message: "Contact info updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update contact info." });
  }
});

module.exports = router;