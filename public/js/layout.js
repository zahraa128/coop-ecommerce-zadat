/**
 * layout.js
 * ----------
 * Loads header and footer on all frontend pages (except login).
 * Provides fallback markup when fetch fails (e.g., file://).
 */

document.addEventListener("DOMContentLoaded", () => {
  const pageName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  if (pageName === "index.html") {
    document.body.classList.add("home-page");
  }

  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  const headerFallback = `
    <link rel="stylesheet" href="styles/header.css">
    <link rel="stylesheet" href="styles/sidebar.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <header class="main-header simple-header">
      <div class="container header-row">
        <button class="sidebar-toggle" id="sidebarToggle" aria-label="Open menu">&#9776;</button>
        <span class="header-brand">Cooperative</span>
      </div>
    </header>
    <aside class="site-sidebar" id="siteSidebar" aria-hidden="true">
      <div class="sidebar-title">Menu</div>
      <a href="index.html">Home</a>
      <a href="shop.html">Shop</a>
      <a href="category.html">Categories</a>
      <a href="cart.html">Cart</a>
      <a href="orders.html">My Orders</a>
      <a href="Aboutus.html">About Us</a>
      <a href="contact.html">Contact</a>
      <a href="#" id="sidebarAuthLink">Login</a>
    </aside>
  `;

  const footerFallback = `
    <link rel="stylesheet" href="styles/footer.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <footer>
      <div class="footer-container">
        <div class="social-links">
          <a href="https://wa.me/96170530807" target="_blank">
            <i class="fab fa-whatsapp"></i> WhatsApp
          </a>
          <a href="https://www.instagram.com/zadat.al.khayrat" target="_blank">
            <i class="fab fa-instagram"></i> Instagram
          </a>
          <a href="https://www.facebook.com/zadatalkyarat" target="_blank">
            <i class="fab fa-facebook-f"></i> Facebook
          </a>
        </div>
        <p class="copyright">
          (c) 2025 Cooperative. All rights reserved.
        </p>
      </div>
    </footer>
  `;

  const ensureHeaderScript = () => {
    if (typeof window.initSiteHeader === "function") {
      window.initSiteHeader();
      return;
    }

    const script = document.createElement("script");
    script.src = "js/header.js";
    script.onload = () => {
      if (typeof window.initSiteHeader === "function") {
        window.initSiteHeader();
      }
    };
    document.body.appendChild(script);
  };

  if (headerEl && pageName !== "index.html") {
    fetch("header.html")
      .then(res => res.text())
      .then(html => {
        headerEl.innerHTML = html;
      })
      .catch(() => {
        headerEl.innerHTML = headerFallback;
      })
      .finally(ensureHeaderScript);
  }

  if (footerEl) {
    fetch("footer.html")
      .then(res => res.text())
      .then(html => {
        footerEl.innerHTML = html;
      })
      .catch(() => {
        footerEl.innerHTML = footerFallback;
      });
  }

  // Track visit once per day per client
  const today = new Date().toISOString().slice(0, 10);
  const lastVisit = localStorage.getItem("last_visit_date");
  if (lastVisit !== today) {
    fetch("/api/track-visit", { method: "POST" })
      .then(() => {
        localStorage.setItem("last_visit_date", today);
      })
      .catch(() => {});
  }
});
