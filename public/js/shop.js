/**
 * shop.js (FINAL VERSION)
 * -----------------------
 * - Loads header & footer
 * - Loads categories
 * - Filters by category (TEXT, not ID)
 * - Displays products correctly
 * - Shows images from Supabase
 */

// Load header & footer
const headerEl = document.getElementById("header");
const footerEl = document.getElementById("footer");

if (headerEl) {
  fetch("header.html")
    .then(r => r.text())
    .then(d => headerEl.innerHTML = d);
}

if (footerEl) {
  fetch("footer.html")
    .then(r => r.text())
    .then(d => footerEl.innerHTML = d);
}

// ===== GET CATEGORY FROM URL =====
const params = new URLSearchParams(window.location.search);
const category = params.get("category");

// ===== ACTIVE BUTTON STYLE =====
const setActiveFilter = (activeCategory) => {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  [...filter.querySelectorAll(".filter-btn")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset.category === activeCategory);
  });
};

// ===== "ALL" BUTTON =====
const bindAllButton = () => {
  const allBtn = document.querySelector(".filter-btn[data-category='']");
  if (!allBtn) return;

  allBtn.addEventListener("click", () => {
    window.location.href = "shop.html";
  });
};

// ===== LOAD CATEGORIES =====
fetch(`${API_URL}/api/categories`)
  .then(res => res.json())
  .then(categories => {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.dataset.category = cat.name;
      btn.textContent = cat.name;

      btn.addEventListener("click", () => {
        const url = `shop.html?category=${encodeURIComponent(cat.name)}`;
        window.location.href = url;
      });

      filter.appendChild(btn);
    });

    setActiveFilter(category || "");
  });

bindAllButton();

// ===== LOAD PRODUCTS =====
let productUrl = `${API_URL}/api/products`;

if (category) {
  productUrl += `?category=${encodeURIComponent(category)}`;
}

fetch(productUrl)
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("productContainer");

    if (!container) return;

    if (!products.length) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${p.image}" alt="${p.name}" width="300">
        <h3>${p.name}</h3>
        <p>Price: $${p.price}</p>
        <a href="product.html?id=${p.id}" class="details-btn">View Details</a>
      `;

      container.appendChild(card);
    });
  })
  .catch(err => {
    console.error("Shop load error:", err);
  });