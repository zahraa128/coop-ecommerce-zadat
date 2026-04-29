/**
 * checkout.js
 * ------------
 * Handles order placement
 */

const express = require("express");
const router = express.Router();
const pool = require("../db");

router.post("/checkout", async (req, res) => {
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

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let customerId = customer_id;

    if (customerId) {
      const existing = await client.query(
        "SELECT c_id FROM customers WHERE c_id = $1 LIMIT 1",
        [customerId]
      );

      if (existing.rows.length === 0) {
        await client.query("ROLLBACK");
        return res.status(404).json({ message: "Customer not found" });
      }
    } else {
      if (!customer) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Missing customer data" });
      }

      const { full_name, phone, address } = customer;
      if (!full_name || !phone || !address) {
        await client.query("ROLLBACK");
        return res.status(400).json({ message: "Missing customer data" });
      }

      const inserted = await client.query(
        "INSERT INTO customers (full_name, phone, address) VALUES ($1, $2, $3) RETURNING c_id",
        [full_name, phone, address]
      );
      customerId = inserted.rows[0].c_id;
    }

    for (const id of Object.keys(cartData)) {
      await client.query(
        `INSERT INTO orders (customers_id, product_id, quantity, order_date, status)
         VALUES ($1, $2, $3, NOW(), $4)`,
        [customerId, id, cartData[id].quantity, "submitted"]
      );
    }

    await client.query("COMMIT");
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
});

module.exports = router;
