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
const categoriesById = new Map();

const escapeHtml = (value = "") => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const formatPrice = (price) => {
  const number = Number(price);
  if (Number.isNaN(number)) return `$${escapeHtml(price)}`;
  return `$${number.toFixed(2)}`;
};

const getShortDescription = (description) => {
  const clean = String(description || "Natural cooperative product crafted with care.").trim();
  return clean.length > 94 ? `${clean.slice(0, 91).trim()}...` : clean;
};

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
      categoriesById.set(String(cat.id), cat.name);

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
    loadProducts();
  })
  .catch(() => {
    loadProducts();
  });

// ===== LOAD PRODUCTS =====
function loadProducts() {
  let url = `${API_URL}/api/products`;

  if (categoryId) {
    url += `?category_id=${categoryId}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(products => {
      const container = document.getElementById("productContainer");

      if (!products.length) {
        container.innerHTML = "<p class=\"empty-state\">No products found.</p>";
        return;
      }

      container.innerHTML = "";

      products.forEach(p => {
        const card = document.createElement("div");
        card.className = "product-card reveal-on-scroll is-visible";

        const categoryName = categoriesById.get(String(p.category_id)) || "Cooperative Product";
        const imageSrc = p.image || "logo.png";

        card.innerHTML = `
          <div class="product-image-frame">
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(p.name)}">
          </div>
          <div class="product-card-body">
            <span class="product-category">${escapeHtml(categoryName)}</span>
            <h3>${escapeHtml(p.name)}</h3>
            <p class="product-description">${escapeHtml(getShortDescription(p.description))}</p>
            <div class="product-card-footer">
              <span class="product-price">${formatPrice(p.price)}</span>
              <a class="details-btn" href="product.html?id=${encodeURIComponent(p.id)}">
                View Product
                <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        `;

        container.appendChild(card);
      });
    })
    .catch(() => {
      const container = document.getElementById("productContainer");
      if (container) {
        container.innerHTML = "<p class=\"empty-state\">Unable to load products right now.</p>";
      }
    });
}
