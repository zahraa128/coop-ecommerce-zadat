const express = require("express");
const db = require("../connect");

const router = express.Router();

// CUSTOMER ORDERS
router.get("/orders", (req, res) => {
  const customerId = req.query.customer_id;

  if (!customerId) {
    return res.status(400).json({ message: "Missing customer_id" });
  }

  const sql = `
    SELECT orders.o_id, orders.quantity, orders.order_date, orders.status,
           products.name AS product_name, products.price
    FROM orders
    JOIN products ON orders.product_id = products.p_id
    WHERE orders.customers_id = ?
    ORDER BY orders.order_date DESC
  `;

  db.query(sql, [customerId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch orders." });
    }
    res.json(results);
  });
});

module.exports = router;
