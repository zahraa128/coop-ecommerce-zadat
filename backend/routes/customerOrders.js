const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

/* ===== GET CLIENT ORDERS ===== */
router.get("/my-orders/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customer_id)
      .order("id", { ascending: false });

    if (error) throw error;

    // ✅ ADD ITEMS COUNT
    const ordersWithCount = await Promise.all(
      orders.map(async (o) => {
        const { count } = await supabase
          .from("order_items")
          .select("*", { count: "exact", head: true })
          .eq("order_id", o.id);

        return {
          ...o,
          items_count: count || 0
        };
      })
    );

    res.json(ordersWithCount);

  } catch (err) {
    res.status(500).json({ message: "Failed to load orders" });
  }
});

module.exports = router;