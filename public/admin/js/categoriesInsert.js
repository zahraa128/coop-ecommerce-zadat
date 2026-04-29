/**
 * categoriesInsert.js
 * --------------------
 * Inserts a new category (admin)
 */

document.getElementById("categoryForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("category_name").value.trim();
  const msg = document.getElementById("message");

  fetch("/api/admin/categories", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(data => {
      if (data.message !== "Category inserted successfully.") {
        msg.style.color = "red";
        msg.textContent = data.message;
        return;
      }

      msg.style.color = "green";
      msg.textContent = "✅ Category inserted successfully.";
      document.getElementById("categoryForm").reset();
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Server error. Try again.";
    });
});
