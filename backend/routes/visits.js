const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== TRACK VISIT ===== */
router.post("/track-visit", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    await supabase.from("visits").insert([{ visit_date: today }]);

    res.json({ message: "Visit tracked" });
  } catch (err) {
    res.status(500).json({ message: "Failed to track visit" });
  }
});

/* ===== GET TODAY VISITS ===== */
router.get("/visits/today", async (req, res) => {
  try {
    const today = new Date().toISOString().slice(0, 10);

    const { count, error } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .eq("visit_date", today);

    if (error) throw error;

    res.json({ count });
  } catch {
    res.status(500).json({ count: 0 });
  }
});

/* ===== GET MONTH VISITS ===== */
router.get("/visits/month", async (req, res) => {
  try {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
      .toISOString()
      .slice(0, 10);

    const end = new Date().toISOString().slice(0, 10);

    const { count, error } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .gte("visit_date", start)
      .lte("visit_date", end);

    if (error) throw error;

    res.json({ count });
  } catch {
    res.status(500).json({ count: 0 });
  }
});

module.exports = router;