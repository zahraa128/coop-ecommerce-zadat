const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");

const router = express.Router();
const upload = multer({ dest: "public/product" });

router.get("/products", async (req, res) => {
  try {
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("*")
      .order("p_id", { ascending: false });

    if (productsError) throw productsError;

    const categoryIds = [...new Set(products.map(p => p.category_id).filter(Boolean))];
    let categoryById = {};

    if (categoryIds.length > 0) {
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("ca_id, name")
        .in("ca_id", categoryIds);

      if (categoriesError) throw categoriesError;
      categoryById = Object.fromEntries(categories.map(c => [c.ca_id, c.name]));
    }

    res.json(products.map(product => ({
      ...product,
      category_name: categoryById[product.category_id] || null
    })));
  } catch {
    res.status(500).json({ message: "Failed to fetch products." });
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
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

router.post("/products", upload.single("image"), async (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  if (!name || !price || !description) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const { error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        description,
        category_id: category_id || null,
        image
      });

    if (error) throw error;
    res.json({ message: "Product inserted successfully." });
  } catch {
    res.status(500).json({ message: "Product insert failed." });
  }
});

router.put("/products/:id", upload.single("image"), async (req, res) => {
  const { name, price, description, category_id } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const updates = {
      name,
      price,
      description,
      category_id: category_id || null
    };

    if (image) {
      updates.image = image;
    }

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("p_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Product updated successfully." });
  } catch {
    res.status(500).json({ message: "Product update failed." });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("p_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Product deleted successfully." });
  } catch {
    res.status(500).json({ message: "Product delete failed." });
  }
});

module.exports = router;
