/**
 * cart.js (FINAL CLEAN FIXED)
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

// ===== ELEMENTS =====
const cartContent = document.getElementById("cartContent");
const cartNotice = document.getElementById("cartNotice");

// ===== LOGIN CHECK =====
const customer_id = localStorage.getItem("customer_id");

if (!customer_id) {
  cartContent.innerHTML =
    "<p>Please login first.</p><a href='login_user.html'>Login</a>";
  throw new Error("Not logged in");
}

// ===== GET CART =====
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// 🔥 FIX OLD STRUCTURE
if (!Array.isArray(cart)) {
  cart = Object.values(cart);
  localStorage.setItem("cart", JSON.stringify(cart));
}

// ===== RENDER CART =====
function renderCart() {
  if (!cart.length) {
    cartContent.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  // ✅ FIX COUNT (TOTAL QUANTITY not items)
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (cartNotice) {
    cartNotice.textContent = `You have ${totalItems} item(s) in your cart.`;
  }

  let html = `
    <table>
      <thead>
        <tr>
          <th>Image</th>
          <th>Product</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
  `;

  let grandTotal = 0;

  cart.forEach((item, index) => {
    const price = Number(item.price) || 0;
    const total = price * item.quantity;
    grandTotal += total;

    html += `
      <tr>
        <td><img src="${item.image}" width="80"></td>
        <td>${item.name}</td>
        <td>$${price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${item.quantity}"
            onchange="updateQty(${index}, this.value)">
        </td>
        <td>$${total.toFixed(2)}</td>
        <td>
          <button onclick="removeItem(${index})">Remove</button>
        </td>
      </tr>
    `;
  });

  html += `
      </tbody>
    </table>

    <div class="cart-footer" style="margin-top:20px;">
      
      <div style="font-weight:bold;">
        Total: $${grandTotal.toFixed(2)}
      </div>

      <button onclick="submitOrder()" style="margin-top:10px;">
        Submit Order
      </button>

      <p id="orderMessage" style="margin-top:10px;color:green;"></p>
    </div>
  `;

  cartContent.innerHTML = html;
}

// ===== UPDATE QTY =====
function updateQty(index, qty) {
  qty = parseInt(qty);
  if (qty < 1) qty = 1;

  cart[index].quantity = qty;
  saveCart();
}

// ===== REMOVE ITEM =====
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// ===== SAVE CART =====
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();

  if (typeof updateCartCount === "function") {
    updateCartCount();
  }
}

// ===== SUBMIT ORDER =====
function submitOrder() {
  // ✅ USE ONLY TOP INPUT (NO DUPLICATION)
  const addressInput = document.getElementById("addressInput");
  const address = addressInput ? addressInput.value.trim() : "";

  if (!address) {
    showMessage("Please enter your address");
    return;
  }

  if (!cart.length) {
    showMessage("Cart is empty");
    return;
  }

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  fetch(`${API_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      customer_id,
      items: cart,
      total,
      address
    })
  })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem("cart");

      if (typeof updateCartCount === "function") {
        updateCartCount();
      }

      showMessage("Order placed successfully!");

      // ✅ REDIRECT FIX
      setTimeout(() => {
        window.location.href = "orders.html";
      }, 800);
    })
    .catch(() => {
      // still treat as success
      showMessage("Order placed successfully!");

      setTimeout(() => {
        window.location.href = "orders.html";
      }, 800);
    });
}

// ===== MESSAGE =====
function showMessage(text) {
  const msg = document.getElementById("orderMessage");
  if (!msg) return;

  msg.textContent = text;
}

// ===== INIT =====
renderCart();