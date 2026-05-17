/**
 * category.js
 * ------------
 * Loads categories from backend and displays them
 */

// Load header & footer
fetch("header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data);

fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

// Fetch categories from backend
const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

fetch(`${API_URL}/api/categories`)
  .then(res => res.json())
  .then(categories => {
    const container = document.getElementById("categoryContainer");

    if (categories.length === 0) {
      container.innerHTML = "<p>No categories found.</p>";
      return;
    }

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "category-card reveal-on-scroll is-visible";
      const name = String(cat.name || "Category");
      const initial = name.trim().charAt(0).toUpperCase() || "C";

      card.innerHTML = `
        <div class="category-icon" aria-hidden="true">${escapeHtml(initial)}</div>
        <span class="category-label">Product Category</span>
        <h3>${escapeHtml(name)}</h3>
        <a class="browse-btn" href="shop.html?category_id=${encodeURIComponent(cat.id)}">
          View Products
          <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
        </a>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error(err);
    document.getElementById("categoryContainer").innerHTML =
      "<p>Error loading categories.</p>";
  });
