router.get("/products", async (req, res) => {
  try {
    const { category } = req.query;

    console.log("Incoming category:", category);

    let query = supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    // 🔥 IMPORTANT FIX
    if (category && category !== "null" && category !== "undefined") {
      query = query.eq("category", category.trim());
    }

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      return res.status(500).json({ error: error.message });
    }

    res.json(data);

  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});