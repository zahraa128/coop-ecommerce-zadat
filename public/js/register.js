/**
 * register.js
 * ------------
 * Handles customer registration
 */

document.getElementById("registerForm").addEventListener("submit", e => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm_password").value;
  const msg = document.getElementById("msg");

  if (password !== confirmPassword) {
    msg.style.color = "red";
    msg.textContent = "Passwords do not match.";
    return;
  }

  const data = {
    full_name: document.getElementById("full_name").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    email: document.getElementById("email").value.trim(),
    address: document.getElementById("address").value.trim(),
    password,
    confirm_password: confirmPassword
  };

  fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      if (result.message !== "Registration successful") {
        msg.style.color = "red";
        msg.textContent = result.message;
        return;
      }

      msg.style.color = "green";
      msg.innerHTML = "Registration successful. <a href='login_user.html'>Login now</a>.";
      document.getElementById("registerForm").reset();
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Server error. Please try again.";
    });
});

const googleRegisterBtn = document.getElementById("googleRegisterBtn");
if (googleRegisterBtn) {
  googleRegisterBtn.addEventListener("click", () => {
    alert("Google login is not configured yet.");
  });
}

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    if (!input) return;
    const isPassword = input.type === "password";
    input.type = isPassword ? "text" : "password";
    btn.textContent = isPassword ? "Hide" : "Show";
  });
});
