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

fetch(`${API_URL}/api/admin/visit-stats`)
  .then(res => res.json())
  .then(stats => {
    const todayEl = document.getElementById("visitsToday");
    const monthEl = document.getElementById("visitsMonth");
    if (todayEl) todayEl.textContent = stats.today;
    if (monthEl) monthEl.textContent = stats.month;
  })
  .catch(() => {});
})();
