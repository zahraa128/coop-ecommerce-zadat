const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

/* ===== GET ABOUT ===== */
router.get("/about", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("about")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json(data || { content: "" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch about" });
  }
});

/* ===== UPDATE ABOUT ===== */
router.put("/about", async (req, res) => {
  try {
    const { content } = req.body;

    // check if row exists
    const { data: existing } = await supabase
      .from("about")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (existing) {
      // update
      const { error } = await supabase
        .from("about")
        .update({ content })
        .eq("id", existing.id);

      if (error) throw error;

    } else {
      // insert first row
      const { error } = await supabase
        .from("about")
        .insert([{ content }]);

      if (error) throw error;
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to save about" });
  }
});

module.exports = router;