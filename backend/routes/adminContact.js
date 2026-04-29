/**
 * adminContact.js
 * ----------------
 * Admin Contact Info management
 */

const express = require("express");
const router = express.Router();
const db = require("../connect");

// GET contact info
router.get("/admin/contact", (req, res) => {
  db.query("SELECT * FROM contact_info LIMIT 1", (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).json({ message: "Contact info not found." });
    }
    res.json(results[0]);
  });
});

// UPDATE contact info
router.put("/admin/contact", (req, res) => {
  const { whatsapp, instagram, messenger } = req.body;

  db.query(
    "UPDATE contact_info SET whatsapp = ?, instagram = ?, messenger = ?",
    [whatsapp, instagram, messenger],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to update contact info." });
      }
      res.json({ message: "Contact info updated successfully." });
    }
  );
});

module.exports = router;
