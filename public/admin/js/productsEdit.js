/**
 * productsEdit.js
 * ----------------
 * Edit product (admin)
 */

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const message = document.getElementById("message");

if (!productId) {
  window.location.href = "products_list.html";
}

// Load categories
fetch("/api/admin/categories-list")
  .then(res => res.json())
  .then(categories => {
    const select = document.getElementById("categorySelect");
    categories.forEach(cat => {
      const opt = document.createElement("option");
      opt.value = cat.ca_id;
      opt.textContent = cat.name;
      select.appendChild(opt);
    });
  });

// Load product
fetch(`/api/admin/products/${productId}`)
  .then(res => res.json())
  .then(p => {
    document.getElementById("product_id").value = p.p_id;
    document.getElementById("name").value = p.name;
    document.getElementById("price").value = p.price;
    document.getElementById("description").value = p.description;
    document.getElementById("categorySelect").value = p.category_id;
    document.getElementById("currentImage").src =
      `/product/${p.image}`;
  });

// Update product
document.getElementById("editProductForm").addEventListener("submit", e => {
  e.preventDefault();

  const formData = new FormData(e.target);

  fetch(`/api/admin/products/${productId}`, {
    method: "PUT",
    body: formData
  })
    .then(res => res.json())
    .then(() => {
      window.location.href = "products_list.html?updated=true";
    })
    .catch(() => {
      message.style.color = "red";
      message.textContent = "Update failed.";
    });
});
