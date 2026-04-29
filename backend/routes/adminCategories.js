const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/admin/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY ca_id");
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});

router.get("/admin/categories-list", async (req, res) => {
  try {
    const result = await pool.query("SELECT ca_id, name FROM categories ORDER BY name");
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});

router.get("/admin/categories/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories WHERE ca_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to fetch category." });
  }
});

router.post("/admin/categories", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name cannot be empty." });
  }

  try {
    await pool.query("INSERT INTO categories (name) VALUES ($1)", [name.trim()]);
    res.json({ message: "Category inserted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to insert category." });
  }
});

router.put("/admin/categories/:id", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name cannot be empty." });
  }

  try {
    await pool.query("UPDATE categories SET name = $1 WHERE ca_id = $2", [name.trim(), req.params.id]);
    res.json({ message: "Category updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update category." });
  }
});

router.delete("/admin/categories/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM categories WHERE ca_id = $1", [req.params.id]);
    res.json({ message: "Category deleted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to delete category." });
  }
});

module.exports = router;
