const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const upload = multer({ dest: "public/product" });

/* ===== GET ALL PRODUCTS ===== */
router.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products." });
  }
});

/* ===== GET PRODUCT BY ID ===== */
router.get("/products/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", req.params.id)
      .maybeSingle();

    if (error) throw error;

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

/* ===== INSERT ===== */
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    console.log("Incoming product:", req.body);

    const { name, price, description, category_id } = req.body;

    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required"
      });
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

    if (error) {
      console.error("Supabase insert product error:", error);
      return res.status(500).json({
        message: "Insert failed",
        error: error.message
      });
    }

    res.json({ success: true, product: data[0] });

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ===== UPDATE ===== */
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category_id } = req.body;

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

    const updates = {
      name,
      description,
      price: Number(price),
      category_id: category_id || null
    };

    if (imageUrl) updates.image = imageUrl;

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
});

/* ===== DELETE ===== */
router.delete("/products/:id", async (req, res) => {
  try {
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
