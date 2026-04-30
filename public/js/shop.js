/**
 * shop.js (FINAL - category_id version)
 */

// ===== HEADER / FOOTER =====
const headerEl = document.getElementById("header");
const footerEl = document.getElementById("footer");

if (headerEl) {
  fetch("header.html").then(r => r.text()).then(d => headerEl.innerHTML = d);
}
if (footerEl) {
  fetch("footer.html").then(r => r.text()).then(d => footerEl.innerHTML = d);
}

// ===== GET CATEGORY ID FROM URL =====
const params = new URLSearchParams(window.location.search);
const categoryId = params.get("category_id");

// ===== ACTIVE BUTTON =====
const setActiveFilter = (activeId) => {
  const filter = document.getElementById("categoryFilter");
  if (!filter) return;

  [...filter.querySelectorAll(".filter-btn")].forEach(btn => {
    btn.classList.toggle("active", btn.dataset.id === activeId);
  });
};

// ===== LOAD CATEGORIES =====
fetch(`${API_URL}/api/categories`)
  .then(res => res.json())
  .then(categories => {
    const filter = document.getElementById("categoryFilter");
    if (!filter) return;

    filter.innerHTML = "";

    // ALL BUTTON
    const allBtn = document.createElement("button");
    allBtn.className = "filter-btn";
    allBtn.dataset.id = "";
    allBtn.textContent = "All";

    allBtn.onclick = () => {
      window.location.href = "shop.html";
    };

    filter.appendChild(allBtn);

    // CATEGORY BUTTONS
    categories.forEach(cat => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.dataset.id = cat.id;
      btn.textContent = cat.name;

      btn.onclick = () => {
        window.location.href = `shop.html?category_id=${cat.id}`;
      };

      filter.appendChild(btn);
    });

    setActiveFilter(categoryId || "");
  });

// ===== LOAD PRODUCTS =====
let url = `${API_URL}/api/products`;

if (categoryId) {
  url += `?category_id=${categoryId}`;
}

fetch(url)
  .then(res => res.json())
  .then(products => {
    const container = document.getElementById("productContainer");

    if (!products.length) {
      container.innerHTML = "<p>No products found.</p>";
      return;
    }

    container.innerHTML = "";

    products.forEach(p => {
      const card = document.createElement("div");
      card.className = "product-card";

      card.innerHTML = `
        <img src="${p.image}" width="300">
        <h3>${p.name}</h3>
        <p>$${p.price}</p>
        <a href="product.html?id=${p.id}">View</a>
      `;

      container.appendChild(card);
    });
  });