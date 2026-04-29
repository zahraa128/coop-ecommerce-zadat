/**
 * adminAbout.js
 * --------------
 * Admin About Us management
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/admin/about", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM about_page LIMIT 1");
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "About content not found." });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to fetch about content." });
  }
});

router.put("/admin/about", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content cannot be empty." });
  }

  try {
    await pool.query("UPDATE about_page SET content = $1", [content]);
    res.json({ message: "About Us updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update content." });
  }
});

module.exports = router;
