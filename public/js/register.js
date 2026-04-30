/**
 * register.js
 * ------------
 * Handles customer registration
 */
router.post("/register", async (req, res) => {
  const { full_name, phone, email, address, password } = req.body;

  if (!full_name || !phone || !email || !address || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const { error } = await supabase
      .from("customers")
      .insert([{
        full_name,
        phone,
        email,
        address,
        password
      }]);

    if (error) throw error;

    res.json({ message: "Registration successful" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

  fetch(`${API_URL}/api/register`, {
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
      msg.textContent = "Registration successful. Redirecting to login...";

      setTimeout(() => {
       window.location.href = "login_user.html";
      }, 1500);
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Server error. Please try again.";
    });
});



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
