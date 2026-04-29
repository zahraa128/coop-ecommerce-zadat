/**
 * home.js
 * --------
 * Replaces PHP session logic on the home page.
 * Handles:
 * - Header & footer loading
 * - Flash messages
 * - Welcome message based on login status
 */

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

// Load header
fetch("header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data)
  .catch(() => {
    document.getElementById("header").innerHTML = headerFallback;
  });

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

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data)
  .catch(() => {
    document.getElementById("footer").innerHTML = footerFallback;
  });

// FLASH MESSAGE (replacement for $_SESSION['flash_message'])
const flashMessage = localStorage.getItem("flash_message");
if (flashMessage) {
  const flashDiv = document.getElementById("flashMessage");
  flashDiv.textContent = flashMessage;
  flashDiv.style.display = "block";

  // Remove message after showing once
  localStorage.removeItem("flash_message");
}

// Welcome message logic
const customerName = localStorage.getItem("customer_name");

const welcomeTitle = document.getElementById("welcomeTitle");
const welcomeSubtitle = document.getElementById("welcomeSubtitle");

if (customerName) {
  // User is logged in
  welcomeTitle.textContent = `Welcome, ${customerName}`;
  welcomeSubtitle.textContent = "Enjoy browsing!";
} else {
  // Guest user
  welcomeTitle.textContent = "Welcome to our Cooperative!";
  welcomeSubtitle.textContent = "Please login for better experience!";
}
