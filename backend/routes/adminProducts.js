const express = require("express");
const multer = require("multer");
const db = require("../connect");

const router = express.Router();

const upload = multer({ dest: "public/product" });

// GET ALL PRODUCTS
router.get("/admin/products", (req, res) => {
  const sql = `
    SELECT products.*, categories.name AS category_name
    FROM products
    LEFT JOIN categories ON products.category_id = categories.ca_id
  `;
  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch products." });
    }
    res.json(results);
  });
});

// GET product by ID
router.get("/admin/products/:id", (req, res) => {
  db.query(
    "SELECT * FROM products WHERE p_id = ?",
    [req.params.id],
    (err, results) => {
      if (err || results.length === 0) {
        return res.status(404).json({ message: "Product not found." });
      }
      res.json(results[0]);
    }
  );
});

// INSERT product
router.post("/admin/products", upload.single("image"), (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price || !description) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  const sql = `
    INSERT INTO products (name, price, description, category_id, image)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [name, price, description, category_id || null, image];

  db.query(sql, params, err => {
    if (err) {
      return res.status(500).json({ message: "Product insert failed." });
    }
    res.json({ message: "Product inserted successfully." });
  });
});

// UPDATE product
router.put("/admin/products/:id", upload.single("image"), (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  let sql;
  let params;

  if (image) {
    sql = `
      UPDATE products
      SET name = ?, price = ?, description = ?, category_id = ?, image = ?
      WHERE p_id = ?
    `;
    params = [name, price, description, category_id, image, req.params.id];
  } else {
    sql = `
      UPDATE products
      SET name = ?, price = ?, description = ?, category_id = ?
      WHERE p_id = ?
    `;
    params = [name, price, description, category_id, req.params.id];
  }

  db.query(sql, params, err => {
    if (err) {
      return res.status(500).json({ message: "Product update failed." });
    }
    res.json({ message: "Product updated successfully." });
  });
});

// DELETE product
router.delete("/admin/products/:id", (req, res) => {
  db.query("DELETE FROM products WHERE p_id = ?", [req.params.id], err => {
    if (err) {
      return res.status(500).json({ message: "Product delete failed." });
    }
    res.json({ message: "Product deleted successfully." });
  });
});

module.exports = router;
