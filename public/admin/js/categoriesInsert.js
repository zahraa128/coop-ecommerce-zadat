/**
 * categoriesInsert.js
 * --------------------
 * Inserts a new category (admin)
 */
const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "/admin/login.html";
}

document.getElementById("categoryForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("category_name").value.trim();
  const msg = document.getElementById("message");

  fetch(`${API_URL}/api/admin/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.success) {
        msg.style.color = "red";
        msg.textContent = data.error || data.message || "Failed to insert category";
        return;
      }

      msg.style.color = "green";
      msg.textContent = "Category inserted successfully.";
      document.getElementById("categoryForm").reset();
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Server error. Try again.";
    });
});
