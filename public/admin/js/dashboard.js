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

// ===== LOAD VISITS STATS =====
fetch(`${API_URL}/api/visits/stats`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("visitsToday").textContent = data.today || 0;
    document.getElementById("visitsMonth").textContent = data.month || 0;
  })
  .catch(err => {
    console.error("Failed to load visit stats:", err);
  });