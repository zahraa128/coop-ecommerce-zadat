const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.get("/orders", async (req, res) => {
  try {
    const { data: orders, error } = await supabase
      .from("orders")
      .select(`
        id,
        total,
        status,
        created_at,
        address,
        customers (full_name, phone),
        order_items (
          quantity,
          price,
          products (name)
        )
      `)
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(orders);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;