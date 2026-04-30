const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    console.log("Incoming category:", category);

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    // ✅ FILTER BY TEXT CATEGORY
    if (category) {
      query = query.eq("category", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

module.exports = router;