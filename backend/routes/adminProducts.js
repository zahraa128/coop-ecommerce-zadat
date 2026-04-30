const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const router = express.Router();
const upload = multer({ dest: "public/product" });

router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;

    let imageUrl = null;

    /* ===== HANDLE IMAGE UPLOAD (same as INSERT) ===== */
    if (req.file) {
      const file = req.file;
      const fileName = `${uuidv4()}-${file.originalname}`;
      const fileBuffer = fs.readFileSync(file.path);

      const { error } = await supabase.storage
        .from("products")
        .upload(fileName, fileBuffer, {
          contentType: file.mimetype
        });

      if (error) {
        console.error("Upload error:", error);
        return res.status(500).json({ message: "Image upload failed" });
      }

      imageUrl = `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${fileName}`;
    }

    /* ===== BUILD UPDATE OBJECT ===== */
    const updates = {
      name,
      description,
      price: Number(price),
      category
    };

    // ✅ ONLY update image if new one uploaded
    if (imageUrl) {
      updates.image = imageUrl;
    }

    const { error } = await supabase
      .from("products")
      .update(updates)
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Product updated successfully." });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({ message: "Product update failed." });
  }
});
module.exports = router;