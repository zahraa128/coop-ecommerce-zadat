document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");

  if (!form) {
    console.error("Form not found");
    return;
  }

  form.addEventListener("submit", e => {
    e.preventDefault(); // 🚨 THIS STOPS REFRESH

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

    console.log("Sending:", data);

    fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        console.log("Response:", result);

        if (result.message !== "Registration successful") {
          msg.style.color = "red";
          msg.textContent = result.message;
          return;
        }

        msg.style.color = "green";
        msg.textContent = "Registration successful. Redirecting...";

        setTimeout(() => {
          window.location.href = "login_user.html";
        }, 1500);
      })
      .catch(err => {
        console.error(err);
        msg.style.color = "red";
        msg.textContent = "Server error.";
      });
  });
});