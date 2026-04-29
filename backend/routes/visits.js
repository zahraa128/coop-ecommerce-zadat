const express = require("express");
const pool = require("../db");

const router = express.Router();

router.post("/track-visit", async (req, res) => {
  try {
    await pool.query("INSERT INTO visits (visit_date) VALUES (CURRENT_DATE)");
    res.json({ message: "Visit tracked." });
  } catch {
    res.status(500).json({ message: "Failed to track visit." });
  }
});

router.get("/admin/visit-stats", async (req, res) => {
  try {
    const today = await pool.query(
      "SELECT COUNT(*)::int AS count FROM visits WHERE visit_date = CURRENT_DATE"
    );
    const month = await pool.query(`
      SELECT COUNT(*)::int AS count
      FROM visits
      WHERE EXTRACT(YEAR FROM visit_date) = EXTRACT(YEAR FROM CURRENT_DATE)
        AND EXTRACT(MONTH FROM visit_date) = EXTRACT(MONTH FROM CURRENT_DATE)
    `);

    res.json({
      today: today.rows[0].count,
      month: month.rows[0].count
    });
  } catch {
    res.status(500).json({ message: "Failed to fetch stats." });
  }
});

module.exports = router;
