/**
 * categoriesEdit.js
 * ------------------
 * Edit category (admin)
 */

const params = new URLSearchParams(window.location.search);
const categoryId = params.get("id");
const msg = document.getElementById("message");

if (!categoryId) {
  window.location.href = "categories.html";
}

// Load existing category
fetch(`/api/admin/categories/${categoryId}`)
  .then(res => res.json())
  .then(cat => {
    document.getElementById("category_name").value = cat.name;
  })
  .catch(() => {
    msg.style.color = "red";
    msg.textContent = "Failed to load category.";
  });

// Update category
document.getElementById("editCategoryForm").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("category_name").value.trim();

  fetch(`/api/admin/categories/${categoryId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name })
  })
    .then(res => res.json())
    .then(data => {
      if (!data.message.includes("successfully")) {
        msg.style.color = "red";
        msg.textContent = data.message;
        return;
      }

      msg.style.color = "green";
      msg.textContent = "✅ Category updated successfully.";
    })
    .catch(() => {
      msg.style.color = "red";
      msg.textContent = "Server error.";
    });
});
