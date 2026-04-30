const tableBody = document.getElementById("productsBody");

async function loadProducts() {
  try {
    console.log("Fetching products...");

    const res = await fetch(`${API_URL}/api/admin/products`);
    const products = await res.json();

    console.log("Products:", products);

    tableBody.innerHTML = "";

    if (!products.length) {
      tableBody.innerHTML = "<tr><td colspan='8'>No products found</td></tr>";
      return;
    }

    products.forEach(product => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${product.id}</td>
        <td>${product.name}</td>
        <td>${product.category || "-"}</td>
        <td>${product.price}</td>
        <td>
          ${product.image 
            ? `<img src="${product.image}"" width="60"/>`
            : "-"
          }
        </td>
        <td>${product.description || "-"}</td>
        <td>
          <a href="products_edit.html?id=${product.id}">Edit</a>
        </td>
        <td>
          <button onclick="deleteProduct(${product.id})">Delete</button>
        </td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error("Load error:", err);
    alert("Failed to load products");
  }
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`   // ✅ IMPORTANT
      }
    });

    const data = await res.json();

    console.log("Delete response:", data);

    if (res.ok) {
      alert("Deleted successfully");
      loadProducts();
    } else {
      alert(data.message || "Delete failed");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

loadProducts();