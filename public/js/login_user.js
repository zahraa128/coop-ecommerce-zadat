/**
 * login.js
 * ---------
 * Handles customer login
 */

// Submit login form
document.getElementById("loginForm").addEventListener("submit", e => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message !== "Login successful") {
        errorMsg.textContent = data.message;
        return;
      }

      // Save login state
      localStorage.setItem("customer_id", data.customer_id);
      localStorage.setItem("customer_name", data.customer_name);

      // Redirect to home
      window.location.href = "index.html";
    })
    .catch(() => {
      errorMsg.textContent = "Server error. Please try again.";
    });
});

const googleLoginBtn = document.getElementById("googleLoginBtn");
if (googleLoginBtn) {
  googleLoginBtn.addEventListener("click", () => {
    alert("Google login is not configured yet.");
  });
}
