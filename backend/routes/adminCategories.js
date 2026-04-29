const express = require("express");
const db = require("../connect");

const router = express.Router();

// GET ALL CATEGORIES
router.get("/admin/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch categories." });
    }
    res.json(results);
  });
});

// GET CATEGORIES FOR SELECT LISTS
router.get("/admin/categories-list", (req, res) => {
  db.query("SELECT ca_id, name FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch categories." });
    }
    res.json(results);
  });
});

// GET CATEGORY BY ID
router.get("/admin/categories/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM categories WHERE ca_id = ?",
    [id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "Category not found." });
      }
      res.json(results[0]);
    }
  );
});

// INSERT CATEGORY
router.post("/admin/categories", (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name cannot be empty." });
  }

  db.query(
    "INSERT INTO categories (name) VALUES (?)",
    [name.trim()],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to insert category." });
      }
      res.json({ message: "Category inserted successfully." });
    }
  );
});

// UPDATE CATEGORY
router.put("/admin/categories/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name cannot be empty." });
  }

  db.query(
    "UPDATE categories SET name = ? WHERE ca_id = ?",
    [name.trim(), id],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to update category." });
      }
      res.json({ message: "Category updated successfully." });
    }
  );
});

// DELETE CATEGORY
router.delete("/admin/categories/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM categories WHERE ca_id = ?", [id], err => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete category." });
    }
    res.json({ message: "Category deleted successfully." });
  });
});

module.exports = router;
