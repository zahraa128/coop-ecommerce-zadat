(() => {
/**
 * dashboard.js
 * -------------
 * Displays admin name on dashboard
 */
const adminToken = localStorage.getItem("token");

if (!adminToken) {
  window.location.href = "/admin/login.html";
}

const adminName = localStorage.getItem("admin_username");

if (adminName) {
  document.getElementById("adminName").textContent = adminName;
}

// ===== VISITS STATS =====
function loadVisits() {
  fetch(`${API_URL}/api/visits/stats`)
    .then(res => res.json())
    .then(data => {
      const todayEl = document.getElementById("visitsToday");
      const monthEl = document.getElementById("visitsMonth");

      if (todayEl) todayEl.textContent = data.today || 0;
      if (monthEl) monthEl.textContent = data.month || 0;
    })
    .catch(err => {
      console.error("Visits error:", err);
    });
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  loadVisits();
});