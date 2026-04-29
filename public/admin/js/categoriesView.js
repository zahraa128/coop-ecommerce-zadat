/**
 * categoriesView.js
 * ------------------
 * Displays & deletes categories (admin)
 */

const tableBody = document.querySelector("#categoriesTable tbody");

// Load categories
fetch("/api/admin/categories")
  .then(res => res.json())
  .then(categories => {
    tableBody.innerHTML = "";

    categories.forEach(cat => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${cat.ca_id}</td>
        <td>${cat.name}</td>
        <td>
          <a href="categories_edit.html?id=${cat.ca_id}">Edit</a> |
          <a href="#" onclick="deleteCategory(${cat.ca_id})">Delete</a>
        </td>
      `;

      tableBody.appendChild(row);
    });
  });

// Delete category
function deleteCategory(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`/api/admin/categories/${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    })
    .catch(() => alert("Failed to delete category."));
}
