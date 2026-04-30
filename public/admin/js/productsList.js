const API_URL = "https://coop-backend-hecq.onrender.com";

const tableBody = document.querySelector("tbody");

async function loadProducts() {
  try {
    const res = await fetch(`${API_URL}/api/admin/products`);
    const products = await res.json();

    tableBody.innerHTML = "";

    products.forEach(product => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.price}</td>
        <td>${product.category || "-"}</td>
        <td>
          <img src="${API_URL}/product/${product.image}" width="60" />
        </td>
        <td>
          <a href="products_edit.html?id=${product.id}">Edit</a> |
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load products");
  }
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": localStorage.getItem("token")
      }
    });

    if (res.ok) {
      alert("Deleted successfully");
      loadProducts();
    } else {
      alert("Delete failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

loadProducts();