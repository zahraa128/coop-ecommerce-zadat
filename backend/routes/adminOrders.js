/**
 * adminOrders.js
 * ---------------
 * Admin view orders with search & sort
 */

const express = require("express");
const router = express.Router();
const db = require("../connect");

router.get("/admin/orders", (req, res) => {
  const sort = req.query.sort === "oldest" ? "ASC" : "DESC";
  const search = req.query.search || "";

  let sql = `
    SELECT orders.o_id, orders.quantity, orders.order_date, orders.status,
           customers.full_name, customers.phone,
           products.name AS product_name, products.price
    FROM orders
    JOIN customers ON orders.customers_id = customers.c_id
    JOIN products ON orders.product_id = products.p_id
  `;

  const params = [];

  if (search) {
    sql += " WHERE customers.full_name LIKE ?";
    params.push(`%${search}%`);
  }

  sql += ` ORDER BY orders.order_date ${sort}`;

  db.query(sql, params, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch orders." });
    }
    res.json(results);
  });
});

// GET DELIVERED ORDERS
router.get("/admin/orders/delivered", (req, res) => {
  const sql = `
    SELECT orders.o_id, orders.quantity, orders.order_date, orders.status,
           customers.full_name, customers.phone,
           products.name AS product_name, products.price
    FROM orders
    JOIN customers ON orders.customers_id = customers.c_id
    JOIN products ON orders.product_id = products.p_id
    WHERE orders.status = 'delivered'
    ORDER BY orders.order_date DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch delivered orders." });
    }
    res.json(results);
  });
});

// UPDATE ORDER STATUS
router.put("/admin/orders/:id/status", (req, res) => {
  const { status } = req.body;
  const allowed = ["submitted", "shipping", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE o_id = ?",
    [status, req.params.id],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to update status." });
      }
      res.json({ message: "Status updated." });
    }
  );
});

// DELETE ORDER
router.delete("/admin/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE o_id = ?", [req.params.id], err => {
    if (err) {
      return res.status(500).json({ message: "Failed to delete order." });
    }
    res.json({ message: "Order deleted." });
  });
});

module.exports = router;
