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

// TODAY
fetch(`${API_URL}/api/visits/today`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("visitsToday").textContent = data.count;
  });

// MONTH
fetch(`${API_URL}/api/visits/month`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("visitsMonth").textContent = data.count;
  });