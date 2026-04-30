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
function addToCart(product) {
  if (!localStorage.getItem("customer_id")) {
    alert("Please login first");
    return;
  }

  const qty = parseInt(document.getElementById("quantity").value);

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.id]) {
    cart[product.id].quantity += qty;
  } else {
    cart[product.id] = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: qty
    };
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Added to cart");
}
module.exports = router;