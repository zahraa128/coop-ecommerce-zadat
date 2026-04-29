/**
 * products.js
 * ------------
 * Handles product & category APIs
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/products", async (req, res) => {
  const categoryId = req.query.category_id;

  let sql = "SELECT * FROM products";
  const params = [];

  if (categoryId) {
    sql += " WHERE category_id = $1";
    params.push(categoryId);
  }

  sql += " ORDER BY p_id DESC";

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM categories ORDER BY name");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE p_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
