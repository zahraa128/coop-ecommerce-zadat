/**
 * products.js
 * ------------
 * Handles product & category APIs
 */

const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

router.get("/products", async (req, res) => {
  const categoryId = req.query.category_id;

  try {
    let query = supabase
      .from("products")
      .select("*")
      .order("p_id", { ascending: false });

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/products/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("p_id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
