const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

/* ===== GET CLIENT ORDERS ===== */
router.get("/my-orders/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customer_id)
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("MY ORDERS ERROR:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

module.exports = router;