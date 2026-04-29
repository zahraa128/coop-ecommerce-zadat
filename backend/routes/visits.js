const express = require("express");
const db = require("../connect");

const router = express.Router();

// Track visit (one per day per client)
router.post("/track-visit", (req, res) => {
  const visitDate = new Date().toISOString().slice(0, 10);

  db.query(
    "INSERT INTO visits (visit_date) VALUES (?)",
    [visitDate],
    err => {
      if (err) {
        return res.status(500).json({ message: "Failed to track visit." });
      }
      res.json({ message: "Visit tracked." });
    }
  );
});

// Admin stats (today + current month)
router.get("/admin/visit-stats", (req, res) => {
  const todaySql = "SELECT COUNT(*) AS count FROM visits WHERE visit_date = CURDATE()";
  const monthSql = `
    SELECT COUNT(*) AS count
    FROM visits
    WHERE YEAR(visit_date) = YEAR(CURDATE())
      AND MONTH(visit_date) = MONTH(CURDATE())
  `;

  db.query(todaySql, (err, todayRows) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch stats." });
    }
    db.query(monthSql, (err2, monthRows) => {
      if (err2) {
        return res.status(500).json({ message: "Failed to fetch stats." });
      }
      res.json({
        today: todayRows[0].count,
        month: monthRows[0].count
      });
    });
  });
});

module.exports = router;
