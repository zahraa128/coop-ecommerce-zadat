const express = require("express");
const supabase = require("../supabase");

const router = express.Router();

router.post("/track-visit", async (req, res) => {
  try {
    const { error } = await supabase
      .from("visits")
      .insert({ visit_date: new Date().toISOString().slice(0, 10) });

    if (error) throw error;
    res.json({ message: "Visit tracked." });
  } catch {
    res.status(500).json({ message: "Failed to track visit." });
  }
});

router.get("/admin/visit-stats", async (req, res) => {
  try {
    const now = new Date();
    const todayDate = now.toISOString().slice(0, 10);
    const monthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
      .toISOString()
      .slice(0, 10);
    const nextMonthStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
      .toISOString()
      .slice(0, 10);

    const [{ count: today, error: todayError }, { count: month, error: monthError }] =
      await Promise.all([
        supabase
          .from("visits")
          .select("*", { count: "exact", head: true })
          .eq("visit_date", todayDate),
        supabase
          .from("visits")
          .select("*", { count: "exact", head: true })
          .gte("visit_date", monthStart)
          .lt("visit_date", nextMonthStart)
      ]);

    if (todayError) throw todayError;
    if (monthError) throw monthError;

    res.json({
      today: today || 0,
      month: month || 0
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

module.exports = router;
