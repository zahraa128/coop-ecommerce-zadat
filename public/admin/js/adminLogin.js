/**
 * adminLogin.js
 * --------------
 * Handles admin login
 */

document.getElementById("adminLoginForm").addEventListener("submit", e => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  fetch(`${API_URL}/api/admin/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        errorMsg.textContent = data.message;
        return;
      }

      // Save admin login state
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_username", data.username);

      // Redirect to admin dashboard
      window.location.href = "dashboard.html";
    })
    .catch(() => {
      errorMsg.textContent = "Server error. Try again.";
    });
});
