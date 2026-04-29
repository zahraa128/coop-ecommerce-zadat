/**
 * productsList.js
 * ----------------
 * List & delete products (admin)
 */

const tableBody = document.querySelector("#productsTable tbody");
const message = document.getElementById("message");

// Success message after edit
if (new URLSearchParams(window.location.search).get("updated") === "true") {
  message.style.color = "green";
  message.textContent = "✅ Product updated successfully.";
}

// Load products
fetch("/api/admin/products")
  .then(res => res.json())
  .then(products => {
    tableBody.innerHTML = "";

    products.forEach(p => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${p.p_id}</td>
        <td>${p.name}</td>
        <td>${p.category_name ?? "-"}</td>
        <td>${p.price}</td>
        <td>
          <img src="/product/${p.image}" width="80">
        </td>
        <td>${p.description}</td>
        <td>
          <a href="products_edit.html?id=${p.p_id}">Edit</a>
        </td>
        <td>
          <a href="#" onclick="deleteProduct(${p.p_id})">Delete</a>
        </td>
      `;

      tableBody.appendChild(row);
    });
  });

// Delete product
function deleteProduct(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`/api/admin/products/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    });
}
