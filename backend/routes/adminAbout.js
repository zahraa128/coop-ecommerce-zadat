/**
 * adminAbout.js
 * --------------
 * Admin About Us management
 */

const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.get("/about", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("about_page")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "About content not found." });
    }
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch about content." });
  }
});

router.put("/about", async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim() === "") {
    return res.status(400).json({ message: "Content cannot be empty." });
  }

  try {
    const { error } = await supabase
      .from("about_page")
      .update({ content })
      .neq("id", 0);

    if (error) throw error;
    res.json({ message: "About Us updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update content." });
  }
});

module.exports = router;
