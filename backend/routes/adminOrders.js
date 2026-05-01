const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== GET ALL ORDERS ===== */
router.get("/orders", async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    // ✅ FIX: inside async function
    const ordersWithCount = await Promise.all(
      orders.map(async (o) => {
        const { count } = await supabase
          .from("order_items")
          .select("*", { count: "exact", head: true })
          .eq("order_id", o.id);

        return {
          ...o,
          products_count: count || 0
        };
      })
    );

    res.json(ordersWithCount);

  } catch (err) {
    console.error("ADMIN ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===== DELIVERED ORDERS ===== */
router.get("/orders/delivered", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "delivered")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to load delivered orders" });
  }
});

/* ===== UPDATE STATUS ===== */
router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Status updated" });

  } catch {
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* ===== ORDER DETAILS ===== */
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError) throw orderError;

    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        price,
        products ( name )
      `)
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    res.json({ order, items });

  } catch (err) {
    console.error("DETAIL ERROR:", err);
    res.status(500).json({ message: "Failed to load order details" });
  }
});

module.exports = router;