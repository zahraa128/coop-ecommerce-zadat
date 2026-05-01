document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  // ===== GLOBAL CART COUNT =====
  window.updateCartCount = function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // support old object format
    if (!Array.isArray(cart)) {
      cart = Object.values(cart);
    }

    const count = cart.reduce((sum, item) => sum + item.quantity, 0);

    const el = document.getElementById("cartCount");
    if (el) el.textContent = count;
  };

  // ===== LOAD HEADER SCRIPT =====
  const loadHeaderScript = () => {
    return new Promise((resolve) => {
      if (typeof window.initSiteHeader === "function") {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "js/header.js";

      script.onload = () => resolve();

      document.body.appendChild(script);
    });
  };

  // ===== LOAD HEADER =====
  if (headerEl) {
    fetch("header.html")
      .then(res => res.text())
      .then(async (html) => {
        headerEl.innerHTML = html;

        // 🔥 ensure header.js loaded
        await loadHeaderScript();

        // 🔥 initialize sidebar + auth
        if (typeof window.initSiteHeader === "function") {
          window.initSiteHeader();
        }

        // 🔥 update cart AFTER header exists
        window.updateCartCount();
      })
      .catch(() => {
        headerEl.innerHTML = "";
      });
  }

  // ===== LOAD FOOTER =====
  if (footerEl) {
    fetch("footer.html")
      .then(res => res.text())
      .then(html => {
        footerEl.innerHTML = html;
      });
  }

  // ===== EXTRA SAFETY (delayed update) =====
  setTimeout(() => {
    if (typeof window.updateCartCount === "function") {
      window.updateCartCount();
    }
  }, 300);
});