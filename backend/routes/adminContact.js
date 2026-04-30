const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== GET CONTACT ===== */
router.get("/contact", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("contact")   // ✅ FIXED TABLE NAME
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    res.json(data || {
      phone: "",
      whatsapp: "",
      instagram: "",
      messenger: ""
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch contact info." });
  }
});

/* ===== UPDATE CONTACT ===== */
router.put("/contact", async (req, res) => {
  try {
    const { phone, whatsapp, instagram, messenger } = req.body;

    // check if row exists
    const { data: existing } = await supabase
      .from("contact")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (existing) {
      // update existing row
      const { error } = await supabase
        .from("contact")
        .update({ phone, whatsapp, instagram, messenger })
        .eq("id", existing.id);

      if (error) throw error;

    } else {
      // insert first row
      const { error } = await supabase
        .from("contact")
        .insert([{ phone, whatsapp, instagram, messenger }]);

      if (error) throw error;
    }

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update contact info." });
  }
});

module.exports = router;