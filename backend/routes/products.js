/**
 * products.js
 * ------------
 * Handles product & category APIs
 */

const express = require("express");
const router = express.Router();
const db = require("../connect");

// GET products (all or by category)
router.get("/products", (req, res) => {
  const categoryId = req.query.category_id;

  let sql = "SELECT * FROM products";
  let params = [];

  if (categoryId) {
    sql += " WHERE category_id = ?";
    params.push(categoryId);
  }

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

// GET categories
router.get("/categories", (req, res) => {
  db.query("SELECT * FROM categories", (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});
// Get product by ID
router.get("/products/:id", (req, res) => {
  const id = req.params.id;

  db.query(
    "SELECT * FROM products WHERE p_id = ?",
    [id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.length === 0)
        return res.status(404).json({ message: "Product not found" });

      res.json(result[0]);
    }
  );
});

module.exports = router;
module.exports = router;
