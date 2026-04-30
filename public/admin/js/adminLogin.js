(function () {
  /**
   * adminLogin.js
   * --------------
   * Handles admin login
   */
  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("adminLoginForm");

    if (!form) {
      return;
    }

    form.addEventListener("submit", e => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value.trim();
      const errorMsg = document.getElementById("error-message") || document.getElementById("errorMsg");

      fetch(`${API_URL}/api/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username,
          password
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            localStorage.setItem("adminLoggedIn", "true");
            localStorage.setItem("admin_username", username);
            localStorage.setItem("token", data.token);
            window.location.href = "/admin/dashboard.html";
          } else if (errorMsg) {
            errorMsg.textContent = data.message || "Login failed";
          }
        })
        .catch(() => {
          if (errorMsg) {
            errorMsg.textContent = "Server error. Try again.";
          }
        });
    });
  });
})();
