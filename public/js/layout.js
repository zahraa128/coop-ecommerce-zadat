document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

  const initRevealAnimations = () => {
    const targets = document.querySelectorAll(
      "main, .home-hero, .brochure-section, .product-card, .category-card, .cart-container, .about-container, .contact-container, .checkout-box"
    );

    targets.forEach((target) => target.classList.add("reveal-on-scroll"));

    if (!("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12 });

    targets.forEach((target) => observer.observe(target));
  };

  // ===== GLOBAL CART COUNT =====
  window.updateCartCount = function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // support old object format
    if (!Array.isArray(cart)) {
      cart = Object.values(cart);
    }

    const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

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

        // load header.js
        await loadHeaderScript();

        // initialize sidebar + login state
        if (typeof window.initSiteHeader === "function") {
          window.initSiteHeader();
        }

        // update cart AFTER header is ready
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

  // ===== LIVE CART UPDATE (🔥 IMPORTANT FIX) =====
  window.addEventListener("storage", () => {
    if (typeof window.updateCartCount === "function") {
      window.updateCartCount();
    }
  });

  // ===== FORCE UPDATE (fallback) =====
  setTimeout(() => {
    if (typeof window.updateCartCount === "function") {
      window.updateCartCount();
    }
  }, 300);

  setTimeout(initRevealAnimations, 80);
});

fetch(`${API_URL}/api/visits`, {
  method: "POST"
});
