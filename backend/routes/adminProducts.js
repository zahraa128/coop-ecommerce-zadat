const express = require("express");
const multer = require("multer");
const supabase = require("../supabase");

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
    console.error("GET PRODUCTS ERROR:", err);
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

    if (!data) {
      return res.status(404).json({ message: "Product not found." });
    }

    res.json(data);
  } catch (err) {
    console.error("GET ONE PRODUCT ERROR:", err);
    res.status(500).json({ message: "Failed to fetch product." });
  }
});

/* ===== INSERT PRODUCT ===== */
router.post("/products", upload.single("image"), async (req, res) => {
  try {
    console.log("Incoming body:", req.body);

    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !price) {
      return res.status(400).json({
        message: "Name and price are required"
      });
    }

    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: name.trim(),
        description: description || "",
        price: Number(price),
        image,
        category: category || ""
      }])
      .select();

    if (error) {
      console.error("SUPABASE ERROR:", error);
      return res.status(500).json({
        message: "Product insert failed",
        error: error.message
      });
    }

    res.json({
      success: true,
      product: data[0]
    });

  } catch (err) {
    console.error("SERVER ERROR:", err);
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
});

/* ===== UPDATE PRODUCT ===== */
router.put("/products/:id", upload.single("image"), async (req, res) => {
  try {
    const { name, price, description, category } = req.body;
    const image = req.file ? req.file.filename : null;

    const updates = {
      name,
      description,
      price: Number(price),
      category
    };

    if (image) {
      updates.image = image;
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

/* ===== DELETE PRODUCT ===== */
async function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;

  try {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });

    const data = await res.json();

    if (res.ok) {
      alert("Deleted successfully");
      location.reload();
    } else {
      alert(data.message || "Delete failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

module.exports = router;