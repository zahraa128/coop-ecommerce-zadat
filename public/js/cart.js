/**
 * cart.js
 * --------
 * Replaces cart.php logic
 * - Reads cart from localStorage
 * - Updates quantity
 * - Removes items
 * - Clears cart
 * - Calculates totals
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


const cartContent = document.getElementById("cartContent");
const cartNotice = document.getElementById("cartNotice");

// Require login for cart actions
if (!localStorage.getItem("customer_id")) {
  if (cartContent) {
    cartContent.innerHTML =
      "<p>Please login first to view your cart.</p><a href='login_user.html'>Login</a>";
  }
  throw new Error("Login required for cart.");
}

// Get cart from localStorage
let cart = JSON.parse(localStorage.getItem("cart")) || {};

// Render cart
function renderCart() {
  if (cartNotice) {
    const count = Object.keys(cart).length;
    cartNotice.textContent =
      count === 0 ? "Your cart is empty." : `You have ${count} item(s) in your cart.`;
  }
  if (Object.keys(cart).length === 0) {
    cartContent.innerHTML = "<p>Your cart is empty.</p>";
    return;
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

  for (let id in cart) {
    const item = cart[id];
    const price = Number(item.price) || 0;
    const total = price * item.quantity;
    grandTotal += total;

    html += `
      <tr>
        <td><img src="/product/${item.image}" width="80"></td>
        <td>${item.name}</td>
        <td>$${price.toFixed(2)}</td>
        <td>
          <input type="number" min="1" value="${item.quantity}"
                 onchange="updateQty(${id}, this.value)">
        </td>
        <td>$${total.toFixed(2)}</td>
        <td>
          <button class="remove-btn" onclick="removeItem(${id})">Remove</button>
        </td>
      </tr>
    `;
  }

  html += `
      </tbody>
    </table>

    <div class="cart-footer">
      <button class="clear-btn" onclick="clearCart()">Clear Cart</button>
      <div class="cart-total">
        Grand Total: $${grandTotal.toFixed(2)}
      </div>
      <button class="checkout-btn" onclick="submitOrder()">Submit Order</button>
    </div>
  `;

  cartContent.innerHTML = html;
}

// Update quantity
function updateQty(id, qty) {
  qty = parseInt(qty);
  if (qty < 1) qty = 1;

  cart[id].quantity = qty;
  saveCart();
}

// Remove item
function removeItem(id) {
  delete cart[id];
  saveCart();
}

// Clear cart
function clearCart() {
  cart = {};
  saveCart();
}

// Save cart to localStorage
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Submit order directly from cart
function submitOrder() {
  const customerId = localStorage.getItem("customer_id");
  if (!customerId) {
    alert("Please login first to place your order.");
    window.location.href = "login_user.html";
    return;
  }

  fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ customer_id: customerId, cart })
  })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem("cart");
      localStorage.setItem("flash_message", "Order placed successfully!");
      window.location.href = "ordersuccess.html";
    })
    .catch(() => alert("Checkout failed"));
}

// Initial render
renderCart();
