/**
 * productsInsert.js
 * ------------------
 * Insert product (admin)
 */

const form = document.getElementById("productForm");
const message = document.getElementById("message");
const categorySelect = document.getElementById("categorySelect");

// Load categories
fetch("/api/admin/categories-list")
  .then(res => res.json())
  .then(categories => {
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.ca_id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  });

// Submit product
form.addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("/api/admin/products", {
    method: "POST",
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (!data.message.includes("success")) {
        message.style.color = "red";
        message.textContent = data.message;
        return;
      }

      message.style.color = "green";
      message.textContent = "✅ Product inserted successfully.";
      form.reset();
    })
    .catch(() => {
      message.style.color = "red";
      message.textContent = "Server error.";
    });
});
