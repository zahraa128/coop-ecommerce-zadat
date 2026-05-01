/**
 * product.js (FINAL FIXED)
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
  alert("No product selected");
  window.location.href = "shop.html";
}

// ===== LOAD PRODUCT =====
fetch(`${API_URL}/api/products/${productId}`)
  .then(res => res.json())
  .then(product => {
    console.log("Loaded product:", product);

    document.getElementById("productName").textContent = product.name;
    document.getElementById("productImage").src = product.image;
    document.getElementById("productPrice").textContent = `$${product.price}`;
    document.getElementById("productDescription").textContent = product.description;

    document.getElementById("addToCartBtn").onclick = () => {
      addToCart(product);
    };
  })
  .catch(() => {
    alert("Failed to load product");
  });

// ===== ADD TO CART =====
function addToCart(product) {
  const customer_id = localStorage.getItem("customer_id");

  if (!customer_id) {
    alert("Please login first");
    window.location.href = "login_user.html";
    return;
  }

  const qty = parseInt(document.getElementById("quantity").value) || 1;

  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  if (cart[product.id]) {
    cart[product.id].quantity += qty;
  } else {
    cart[product.id] = {
      id: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: qty
    };
  }

  localStorage.setItem("cart", JSON.stringify(cart));

  alert("Product added to cart successfully!");
}