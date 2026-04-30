const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== GET PRODUCTS ===== */
router.get("/products", async (req, res) => {
  try {
    const { category_id } = req.query;

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    // ✅ FILTER BY CATEGORY ID
    if (category_id) {
      query = query.eq("category_id", category_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* ===== GET CATEGORIES ===== */
router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("CATEGORIES ERROR:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

module.exports = router;