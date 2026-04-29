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
fetch("/api/categories")
  .then(res => res.json())
  .then(categories => {
    const container = document.getElementById("categoryContainer");

    if (categories.length === 0) {
      container.innerHTML = "<p>No categories found.</p>";
      return;
    }

    categories.forEach(cat => {
      const card = document.createElement("div");
      card.className = "category-card";

      card.innerHTML = `
        <h3>${cat.name}</h3>
        <a href="shop.html?category_id=${cat.ca_id}" class="browse-btn">
          Browse Products
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
