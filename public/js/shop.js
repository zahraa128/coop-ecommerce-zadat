/**
 * shop.js
 * --------
 * Replaces shop.php logic
 * - Loads header & footer
 * - Fetches categories
 * - Fetches products
 * - Filters by category
 */

// Load header & footer
const headerEl = document.getElementById("header");
const footerEl = document.getElementById("footer");
if (headerEl) {
  fetch("header.html").then(r => r.text()).then(d => headerEl.innerHTML = d);
}
if (footerEl) {
  fetch("footer.html").then(r => r.text()).then(d => footerEl.innerHTML = d);
}

// Get category from URL
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("category_id");

const setActiveFilter = (activeId) => {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;
  [...filter.querySelectorAll(".filter-btn")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === activeId);
  });
};

const bindAllButton = () => {
  const allBtn = document.querySelector(".filter-btn[data-id='']");
  if (!allBtn) return;
  allBtn.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
};

// Load categories
fetch("/api/categories")
  .then(res => res.json())
  .then(categories => {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.dataset.id = cat.ca_id;
      btn.textContent = cat.name;
      btn.addEventListener("click", () => {
        const url = cat.ca_id ? `shop.html?category_id=${cat.ca_id}` : "shop.html";
        window.location.href = url;
      });
      filter.appendChild(btn);
    });

    setActiveFilter(categoryId || "");
  });

bindAllButton();

// Load products
let productUrl = "/api/products";
if (categoryId) {
  productUrl += `?category_id=${categoryId}`;
}

fetch(productUrl)
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("productContainer");

    if (products.length === 0) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="/product/${p.image}" alt="${p.name}" width="300">
        <h3>${p.name}</h3>
        <p>Price: $${p.price}</p>
        <a href="product.html?p_id=${p.p_id}" class="details-btn">View Details</a>
      `;

      container.appendChild(card);
    });
  });
