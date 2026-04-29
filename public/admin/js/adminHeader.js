/**
 * adminHeader.js
 * ----------------
 * Protects admin pages + handles logout
 */

// Protect admin pages
if (localStorage.getItem("adminLoggedIn") !== "true") {
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("admin-header");
  if (!headerContainer) return;

  const fallbackHeader = `
    <link rel="stylesheet" href="css/header.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <header class="main-header">
      <div class="container">
        <nav>
          <a href="dashboard.html"><i class="fas fa-home"></i> Dashboard</a>
          <a href="products_list.html"><i class="fas fa-box"></i> Products</a>
          <a href="categories.html"><i class="fas fa-tags"></i> Categories</a>
          <a href="orders.html"><i class="fas fa-shopping-cart"></i> Orders</a>
          <a href="delivered_orders.html"><i class="fas fa-truck"></i> Delivered</a>
          <a href="about.html"><i class="fas fa-circle-info"></i> About</a>
          <a href="contact.html"><i class="fas fa-envelope"></i> Contact</a>
          <a href="#" id="logoutBtn">Logout</a>
        </nav>
      </div>
    </header>
  `;

  const bindLogout = () => {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", e => {
        e.preventDefault();

        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("admin_username");

        window.location.href = "login.html";
      });
    }
  };

  // Load admin header
  fetch("admin_header.html")
    .then(res => res.text())
    .then(html => {
      headerContainer.innerHTML = html;
      bindLogout();
    })
    .catch(err => {
      console.error("Failed to load admin header:", err);
      headerContainer.innerHTML = fallbackHeader;
      bindLogout();
    });
});
