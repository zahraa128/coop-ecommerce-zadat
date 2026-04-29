/**
 * checkout.js
 * ------------
 * Handles order placement
 */

const express = require("express");
const router = express.Router();
const db = require("../connect");

// Place order
router.post("/checkout", (req, res) => {
  const { customer, cart, customer_id } = req.body || {};
  let cartData = cart;

  if (typeof cartData === "string") {
    try {
      cartData = JSON.parse(cartData);
    } catch {
      cartData = null;
    }
  }

  if (!cartData || Object.keys(cartData).length === 0) {
    return res.status(400).json({ message: "Invalid order data" });
  }

  const createOrders = (customerId) => {
    const orderValues = Object.keys(cartData).map(id => [
      customerId,
      id,
      cartData[id].quantity,
      new Date(),
      "submitted"
    ]);

    const sql =
      "INSERT INTO orders (customers_id, product_id, quantity, order_date, status) VALUES ?";

    db.query(sql, [orderValues], (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "Order placed successfully" });
    });
  };

  if (customer_id) {
    db.query(
      "SELECT c_id FROM customers WHERE c_id = ? LIMIT 1",
      [customer_id],
      (err, results) => {
        if (err) return res.status(500).json(err);
        if (results.length === 0) {
          return res.status(404).json({ message: "Customer not found" });
        }
        createOrders(customer_id);
      }
    );
    return;
  }

  if (!customer) {
    return res.status(400).json({ message: "Missing customer data" });
  }

  const { full_name, phone, address } = customer;
  if (!full_name || !phone || !address) {
    return res.status(400).json({ message: "Missing customer data" });
  }

  db.query(
    "INSERT INTO customers (full_name, phone, address) VALUES (?, ?, ?)",
    [full_name, phone, address],
    (err, result) => {
      if (err) return res.status(500).json(err);
      createOrders(result.insertId);
    }
  );
});

module.exports = router;
