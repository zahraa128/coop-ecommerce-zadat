/**
 * checkout.js
 * ------------
 * Handles order placement
 */

const express = require("express");
const router = express.Router();
const supabase = require("../supabase");
console.log("CHECKOUT HIT");
console.log(req.body);

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

  try {
    let customerId = customer_id;

    if (customerId) {
      const { data: existing, error: existingError } = await supabase
        .from("customers")
        .select("c_id")
        .eq("c_id", customerId)
        .maybeSingle();

      if (existingError) throw existingError;
      if (!existing) {
        return res.status(404).json({ message: "Customer not found" });
      }
    } else {
      if (!customer) {
        return res.status(400).json({ message: "Missing customer data" });
      }

      const { full_name, phone, address } = customer;
      if (!full_name || !phone || !address) {
        return res.status(400).json({ message: "Missing customer data" });
      }

      const { data: inserted, error: insertCustomerError } = await supabase
        .from("customers")
        .insert({ full_name, phone, address })
        .select("c_id")
        .single();

      if (insertCustomerError) throw insertCustomerError;
      customerId = inserted.c_id;
    }

    const orderRows = Object.keys(cartData).map(id => ({
      customers_id: customerId,
      product_id: id,
      quantity: cartData[id].quantity,
      order_date: new Date().toISOString(),
      status: "submitted"
    }));

    const { error: insertOrdersError } = await supabase
      .from("orders")
      .insert(orderRows);

    if (insertOrdersError) throw insertOrdersError;
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
