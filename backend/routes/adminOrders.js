/**
 * adminOrders.js
 * ---------------
 * Admin view orders with search & sort
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.get("/admin/orders", async (req, res) => {
  const sort = req.query.sort === "oldest" ? "ASC" : "DESC";
  const search = req.query.search || "";

  const params = [];
  let where = "";

  if (search) {
    params.push(`%${search}%`);
    where = "WHERE customers.full_name ILIKE $1";
  }

  const sql = `
    SELECT orders.o_id, orders.quantity, orders.order_date, orders.status,
           customers.full_name, customers.phone,
           products.name AS product_name, products.price
    FROM orders
    JOIN customers ON orders.customers_id = customers.c_id
    JOIN products ON orders.product_id = products.p_id
    ${where}
    ORDER BY orders.order_date ${sort}
  `;

  try {
    const result = await pool.query(sql, params);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

router.get("/admin/orders/delivered", async (req, res) => {
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

  try {
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: "Failed to fetch delivered orders." });
  }
});

router.put("/admin/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["submitted", "shipping", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    await pool.query("UPDATE orders SET status = $1 WHERE o_id = $2", [status, req.params.id]);
    res.json({ message: "Status updated." });
  } catch {
    res.status(500).json({ message: "Failed to update status." });
  }
});

router.delete("/admin/orders/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM orders WHERE o_id = $1", [req.params.id]);
    res.json({ message: "Order deleted." });
  } catch {
    res.status(500).json({ message: "Failed to delete order." });
  }
});

module.exports = router;
