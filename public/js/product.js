/**
 * product.js
 * ----------
 * Replaces product.php logic
 */

// Load header & footer
const headerEl = document.getElementById("header");
const footerEl = document.getElementById("footer");
if (headerEl) {
  fetch("header.html").then(r => r.text()).then(d => headerEl.innerHTML = d);
}
if (footerEl) {
  fetch("footer.html").then(r => r.text()).then(d => footerEl.innerHTML = d);
}

// Get product ID from URL
const params = new URLSearchParams(window.location.search);
const productId = params.get("p_id");

if (!productId) {
  alert("No product selected");
  window.location.href = "shop.html";
}

// Fetch product details
fetch(`/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    document.getElementById("productName").textContent = product.name;
    document.getElementById("productImage").src =
      `/product/${product.image}`;
    document.getElementById("productPrice").textContent = product.price;
    document.getElementById("productDescription").textContent = product.description;

    // Add to cart button
    document.getElementById("addToCartBtn").onclick = () => {
      addToCart(product);
    };
  });

// Add to cart
function addToCart(product) {
  if (!localStorage.getItem("customer_id")) {
    showNotification("Please login first to add items to your cart.");
    return;
  }
  const qty = parseInt(document.getElementById("quantity").value);

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.p_id]) {
    cart[product.p_id].quantity += qty;
  } else {
    cart[product.p_id] = {
      id: product.p_id,
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

// Notification
function showNotification(msg) {
  const note = document.getElementById("notification");
  note.textContent = msg;
  note.style.display = "block";
  window.scrollTo({ top: 0, behavior: "smooth" });
}
