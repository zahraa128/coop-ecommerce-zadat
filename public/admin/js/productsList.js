const tableBody = document.getElementById("productsBody");

// ===== LOAD PRODUCTS =====
async function loadProducts(url = `${API_URL}/api/admin/products`) {
  try {
    const res = await fetch(url);
    const products = await res.json();

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
        <td>${product.categories?.name || "No category"}</td>
        <td>${product.price}</td>
        <td>
          ${product.image ? `<img src="${product.image}" width="60"/>` : "-"}
        </td>
        <td>${product.description || "-"}</td>
        <td><a href="products_edit.html?id=${product.id}">Edit</a></td>
        <td><button onclick="deleteProduct(${product.id})">Delete</button></td>
      `;

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    alert("Failed to load products");
  }
}

// ===== DELETE =====
async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

  try {
    const res = await fetch(`${API_URL}/api/admin/products/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error();

    alert("Deleted");
    loadProducts();

  } catch {
    alert("Delete failed");
  }
}

// ===== LOAD CATEGORIES =====
fetch(`${API_URL}/api/admin/categories`)
  .then(res => res.json())
  .then(categories => {
    const select = document.getElementById("categoryFilter");

    categories.forEach(c => {
      select.innerHTML += `<option value="${c.id}">${c.name}</option>`;
    });
  });

// ===== FILTER =====
document.getElementById("categoryFilter").addEventListener("change", function () {
  const categoryId = this.value;

  let url = `${API_URL}/api/admin/products`;
  if (categoryId) {
    url += `?category=${categoryId}`;
  }

  loadProducts(url);
});

// ===== INIT =====
loadProducts();