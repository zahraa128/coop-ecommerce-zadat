/**
 * cart.js
 * --------
 * Handles cart logic (API)
 */

const express = require("express");
const router = express.Router();

// Add to cart (client sends product data)
router.post("/cart", (req, res) => {
  const { product, quantity } = req.body;

  if (!product || quantity < 1) {
    return res.status(400).json({ message: "Invalid data" });
  }

  res.json({
    message: "Product added to cart successfully",
    product,
    quantity
  });
});

module.exports = router;
