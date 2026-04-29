const express = require("express");
const pool = require("../db");

const router = express.Router();

router.get("/orders", async (req, res) => {
  const customerId = req.query.customer_id;

  if (!customerId) {
    return res.status(400).json({ message: "Missing customer_id" });
  }

  const sql = `
    SELECT orders.o_id, orders.quantity, orders.order_date, orders.status,
           products.name AS product_name, products.price
    FROM orders
    JOIN products ON orders.product_id = products.p_id
    WHERE orders.customers_id = $1
    ORDER BY orders.order_date DESC
  `;

  try {
    const result = await pool.query(sql, [customerId]);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

module.exports = router;
