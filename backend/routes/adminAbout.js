/**
 * adminAbout.js
 * --------------
 * Admin About Us management
 */

const express = require("express");
const router = express.Router();
const db = require("../connect");

// GET ABOUT CONTENT
router.get("/admin/about", (req, res) => {
  db.query("SELECT * FROM about_page LIMIT 1", (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "About content not found." });
    }
    res.json(results[0]);
  });
});

// UPDATE ABOUT CONTENT
router.put("/admin/about", (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content cannot be empty." });
  }

  db.query(
    "UPDATE about_page SET content = ?",
    [content],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to update content." });
      }
      res.json({ message: "About Us updated successfully." });
    }
  );
});

module.exports = router;
