document.addEventListener("DOMContentLoaded", () => {
  const headerEl = document.getElementById("header");
  const footerEl = document.getElementById("footer");

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

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || {};
    const count = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);

    const el = document.getElementById("cartCount");
    if (el) el.textContent = count;
  }

  if (headerEl) {
    fetch("header.html")
      .then(res => res.text())
      .then(html => {
        headerEl.innerHTML = html;
      })
      .catch(() => {
        headerEl.innerHTML = "";
      })
      script.onload = () => {
  if (typeof window.initSiteHeader === "function") {
    window.initSiteHeader();
  }

  // 🔥 update cart AFTER header exists
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
};

  }

  if (footerEl) {
    fetch("footer.html")
      .then(res => res.text())
      .then(html => {
        footerEl.innerHTML = html;
      });
  }
});
window.addEventListener("storage", () => {
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
});