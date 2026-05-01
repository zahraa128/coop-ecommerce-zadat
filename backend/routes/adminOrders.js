const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== GET ALL ORDERS ===== */
router.get("/orders", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

module.exports = router;