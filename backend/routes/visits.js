const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== ADD VISIT ===== */
router.post("/", async (req, res) => {
  try {
    const { error } = await supabase
      .from("visits")
      .insert([{}]);

    if (error) throw error;

    res.json({ message: "Visit recorded" });
  } catch (err) {
    res.status(500).json({ message: "Failed to record visit" });
  }
});

/* ===== GET STATS ===== */
router.get("/stats", async (req, res) => {
  try {
    // today
    const today = new Date();
    today.setHours(0,0,0,0);

    const { count: todayCount } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .gte("created_at", today.toISOString());

    // this month
    const month = new Date();
    month.setDate(1);
    month.setHours(0,0,0,0);

    const { count: monthCount } = await supabase
      .from("visits")
      .select("*", { count: "exact", head: true })
      .gte("created_at", month.toISOString());

    res.json({
      today: todayCount || 0,
      month: monthCount || 0
    });

  } catch (err) {
    res.status(500).json({ message: "Failed to load stats" });
  }
});

module.exports = router;