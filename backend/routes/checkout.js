const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== PLACE ORDER ===== */
router.post("/checkout", async (req, res) => {
  try {
    const { customer_id, items, total, address } = req.body;

    console.log("CHECKOUT HIT:", req.body);

    if (!customer_id || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // ✅ 1. GET CUSTOMER INFO
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .select("full_name, phone")
      .eq("id", customer_id)
      .single();

    if (customerError || !customer) {
      throw new Error("Customer not found");
    }

    // ✅ 2. INSERT ORDER (WITH NAME + PHONE)
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        customer_id,
        customer_name: customer.full_name,
        phone: customer.phone,
        total,
        address,
        status: "pending"
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // ✅ 3. INSERT ORDER ITEMS
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

module.exports = router;