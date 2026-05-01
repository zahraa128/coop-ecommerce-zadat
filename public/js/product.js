/**
 * product.js (FINAL FIXED - ARRAY CART)
 */

// ===== LOAD HEADER / FOOTER =====
const headerEl = document.getElementById("header");
const footerEl = document.getElementById("footer");

if (headerEl) {
  fetch("header.html").then(r => r.text()).then(d => headerEl.innerHTML = d);
}
if (footerEl) {
  fetch("footer.html").then(r => r.text()).then(d => footerEl.innerHTML = d);
}

// ===== GET PRODUCT ID =====
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

if (!productId) {
  window.location.href = "shop.html";
}

// ===== LOAD PRODUCT =====
fetch(`${API_URL}/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productImage").src = product.image;
    document.getElementById("productPrice").textContent = `$${product.price}`;
    document.getElementById("productDescription").textContent = product.description;

    document.getElementById("addToCartBtn").onclick = () => {
      addToCart(product);
    };
  })
  .catch(() => {
    showMessage("Failed to load product");
  });

// ===== ADD TO CART (ARRAY VERSION) =====
function addToCart(product) {
  const customer_id = localStorage.getItem("customer_id");

  if (!customer_id) {
    showMessage("Please login first");
    window.location.href = "login_user.html";
    return;
  }

  const qty = parseInt(document.getElementById("quantity").value) || 1;

  // ✅ ALWAYS ARRAY
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 🔥 FIX OLD DATA (object → array)
  if (!Array.isArray(cart)) {
    cart = Object.values(cart);
  }

  // ✅ CHECK IF EXISTS
  const existing = cart.find(item => item.id === product.id);

  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: qty
    });
  }

  // ✅ SAVE
  localStorage.setItem("cart", JSON.stringify(cart));

  // ✅ UPDATE ICON
  if (typeof updateCartCount === "function") {
    updateCartCount();
  }

showMessage("Product added to cart successfully!");

// 🔥 scroll to top so user sees message
window.scrollTo({
  top: 0,
  behavior: "smooth"
});
if (typeof updateCartCount === "function") {
  updateCartCount();
}
}

// ===== MESSAGE =====
function showMessage(text) {
  const msg = document.getElementById("cartMessage");
  if (!msg) return;

  msg.textContent = text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}