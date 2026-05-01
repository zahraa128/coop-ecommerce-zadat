const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const upload = multer({ dest: "public/product" });

/* ===== GET PRODUCTS (WITH CATEGORY + FILTER) ===== */
router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    let query = supabase
      .from("products")
      .select(`
        id,
        name,
        price,
        description,
        image,
        category_id,
        categories ( name )
      `)
      .order("id", { ascending: false });

    if (category) {
      query = query.eq("category_id", category);
    }

    const { data, error } = await query;

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("PRODUCT FETCH ERROR:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});

/* ===== INSERT ===== */
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Name and price are required" });
    }

    let imageUrl = null;

    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;
      const fileBuffer = fs.readFileSync(file.path);

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype
        });

      if (error) throw error;

      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: name.trim(),
        description: description || "",
        price: Number(price),
        image: imageUrl || "",
        category_id: category_id || null
      }])
      .select();

    if (error) throw error;

    res.json({ success: true, product: data[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert failed" });
  }
});

/* ===== DELETE ===== */
router.delete("/products/:id", async (req, res) => {
  try {
    await supabase.from("order_items").delete().eq("product_id", req.params.id);

    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;
/* ===== GET PRODUCT BY ID ===== */
router.get("/products/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .single();

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error("GET PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});
/* ===== UPDATE PRODUCT ===== */
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({ message: "Missing data" });
    }

    let updates = {
      name,
      description: description || "",
      price: Number(price),
      category_id: category_id || null
    };

    // ✅ only update image if new one uploaded
    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;
      const fileBuffer = fs.readFileSync(file.path);

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype
        });

      if (error) throw error;

      updates.image = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    }

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ success: true });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
});