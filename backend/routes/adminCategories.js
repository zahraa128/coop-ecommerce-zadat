const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.get("/categories", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("ca_id", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});

router.get("/categories-list", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("ca_id, name")
      .order("name", { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch categories." });
  }
});

router.get("/categories/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("ca_id", req.params.id)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.json(data);
  } catch {
    res.status(500).json({ message: "Failed to fetch category." });
  }
});

router.post("/categories", async (req, res) => {
  try {
    console.log("Category insert body:", req.body);

    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Category name is required" });
    }

    const { data, error } = await supabase
      .from("categories")
      .insert([{ name: name.trim() }])
      .select();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({
        message: "Failed to insert category",
        error: error.message
      });
    }

    res.json({
      success: true,
      category: data[0]
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/categories/:id", async (req, res) => {
  const { name } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Category name cannot be empty." });
  }

  try {
    const { error } = await supabase
      .from("categories")
      .update({ name: name.trim() })
      .eq("ca_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Category updated successfully." });
  } catch {
    res.status(500).json({ message: "Failed to update category." });
  }
});

router.delete("/categories/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("ca_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Category deleted successfully." });
  } catch {
    res.status(500).json({ message: "Failed to delete category." });
  }
});

module.exports = router;
