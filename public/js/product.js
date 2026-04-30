/**
 * product.js (FINAL VERSION)
 * --------------------------
 * - Uses correct product ID
 * - Loads product correctly
 * - Displays Supabase images
 * - Fixes cart logic
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

// ===== GET PRODUCT ID FROM URL =====
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");   // ✅ FIXED

if (!productId) {
  alert("No product selected");
  window.location.href = "shop.html";
}

// ===== FETCH PRODUCT =====
fetch(`${API_URL}/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    console.log("Product:", product);

    document.getElementById("productName").textContent = product.name;
    document.getElementById("productImage").src = product.image; // ✅ FIXED
    document.getElementById("productPrice").textContent = product.price;
    document.getElementById("productDescription").textContent = product.description;

    // Add to cart
    document.getElementById("addToCartBtn").onclick = () => {
      addToCart(product);
    };
  })
  .catch(err => {
    console.error("Product load error:", err);
  });

// ===== ADD TO CART =====
function addToCart(product) {
  if (!localStorage.getItem("customer_id")) {
    showNotification("Please login first to add items to your cart.");
    return;
  }

  const qty = parseInt(document.getElementById("quantity").value) || 1;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.id]) {   // ✅ FIXED
    cart[product.id].quantity += qty;
  } else {
    cart[product.id] = {
      id: product.id,       // ✅ FIXED
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image,
      quantity: qty
    };
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  localStorage.setItem("flash_message", "Product added to cart successfully.");

  showNotification("Product added to cart successfully.");
}

// ===== NOTIFICATION =====
function showNotification(msg) {
  const note = document.getElementById("notification");
  if (!note) return;

  note.textContent = msg;
  note.style.display = "block";

  window.scrollTo({ top: 0, behavior: "smooth" });
}