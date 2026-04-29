const express = require("express");
const multer = require("multer");
const pool = require("../db");

const router = express.Router();
const upload = multer({ dest: "public/product" });

router.get("/admin/products", async (req, res) => {
  const sql = `
    SELECT products.*, categories.name AS category_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.ca_id
    ORDER BY products.p_id DESC
  `;

  try {
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

router.get("/admin/products/:id", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products WHERE p_id = $1", [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

router.post("/admin/products", upload.single("image"), async (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price || !description) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    await pool.query(
      `INSERT INTO products (name, price, description, category_id, image)
       VALUES ($1, $2, $3, $4, $5)`,
      [name, price, description, category_id || null, image]
    );
    res.json({ message: "Product inserted successfully." });
  } catch {
    res.status(500).json({ message: "Product insert failed." });
  }
});

router.put("/admin/products/:id", upload.single("image"), async (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  const sql = image
    ? `UPDATE products
       SET name = $1, price = $2, description = $3, category_id = $4, image = $5
       WHERE p_id = $6`
    : `UPDATE products
       SET name = $1, price = $2, description = $3, category_id = $4
       WHERE p_id = $5`;

  const params = image
    ? [name, price, description, category_id || null, image, req.params.id]
    : [name, price, description, category_id || null, req.params.id];

  try {
    await pool.query(sql, params);
    res.json({ message: "Product updated successfully." });
  } catch {
    res.status(500).json({ message: "Product update failed." });
  }
});

router.delete("/admin/products/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM products WHERE p_id = $1", [req.params.id]);
    res.json({ message: "Product deleted successfully." });
  } catch {
    res.status(500).json({ message: "Product delete failed." });
  }
});

module.exports = router;
