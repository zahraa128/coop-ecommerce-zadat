/**
 * header.js
 * ----------
 * Initializes the shared header after it is either present in the page
 * or injected by layout.js.
 */

(() => {
  const bindLogout = (link) => {
    if (!link || link.dataset.logoutBound === "true") return;

    link.dataset.logoutBound = "true";
    link.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("customer_id");
      localStorage.removeItem("customer_name");
      window.location.href = "login_user.html";
    });
  };

  const closeSidebar = () => {
    document.body.classList.remove("sidebar-open");

    const sidebar = document.getElementById("siteSidebar");
    const toggle = document.getElementById("sidebarToggle");

    if (sidebar) sidebar.setAttribute("aria-hidden", "true");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
    }
  };

  const openSidebar = () => {
    document.body.classList.add("sidebar-open");

    const sidebar = document.getElementById("siteSidebar");
    const toggle = document.getElementById("sidebarToggle");

    if (sidebar) sidebar.setAttribute("aria-hidden", "false");
    if (toggle) {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
    }
  };

  window.initSiteHeader = () => {
    const isLoggedIn = localStorage.getItem("customer_id");
    const pageName = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();

    if (pageName === "index.html") {
      document.body.classList.add("home-page");
    }

    const nav = document.getElementById("navLinks");
    const sidebar = document.getElementById("siteSidebar");
    const sidebarAuthLink = document.getElementById("sidebarAuthLink");
    const sidebarToggle = document.getElementById("sidebarToggle");

    if (nav && !nav.querySelector("[data-auth-link='true']")) {
      const authLink = document.createElement("a");
      authLink.dataset.authLink = "true";

      if (isLoggedIn) {
        authLink.href = "#";
        authLink.textContent = "Logout";
        bindLogout(authLink);
      } else {
        authLink.href = "login_user.html";
        authLink.textContent = "Login";
      }

      nav.appendChild(authLink);
    }

    if (sidebarAuthLink) {
      if (isLoggedIn) {
        sidebarAuthLink.textContent = "Logout";
        sidebarAuthLink.href = "#";
        bindLogout(sidebarAuthLink);
      } else {
        sidebarAuthLink.textContent = "Login";
        sidebarAuthLink.href = "login_user.html";
      }
    }

    if (sidebar) {
      sidebar.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href")?.toLowerCase();
        if (href && href === pageName) {
          link.classList.add("active");
          link.setAttribute("aria-current", "page");
        }
      });
    }

    if (sidebarToggle && sidebarToggle.dataset.sidebarBound !== "true") {
      sidebarToggle.dataset.sidebarBound = "true";
      sidebarToggle.setAttribute("aria-expanded", "false");
      sidebarToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        if (document.body.classList.contains("sidebar-open")) {
          closeSidebar();
        } else {
          openSidebar();
        }
      });
    }

    if (sidebar && sidebar.dataset.sidebarLinksBound !== "true") {
      sidebar.dataset.sidebarLinksBound = "true";
      sidebar.addEventListener("click", (event) => {
        const link = event.target.closest("a");
        if (link && link.id !== "sidebarAuthLink") closeSidebar();
      });
    }
  };

  document.addEventListener("click", (event) => {
    if (!document.body.classList.contains("sidebar-open")) return;

    const sidebar = document.getElementById("siteSidebar");
    const toggle = document.getElementById("sidebarToggle");
    if (sidebar?.contains(event.target) || toggle?.contains(event.target)) return;

    closeSidebar();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeSidebar();
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", window.initSiteHeader);
  } else {
    window.initSiteHeader();
  }
  
})();
