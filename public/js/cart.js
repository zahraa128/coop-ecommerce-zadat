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
        <td><img src="${item.image}" width="80"></td>
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
  const customer_id = localStorage.getItem("customer_id");

  if (!customer_id) {
    showOrderMessage("Please login first");
    return;
  }

  const items = Object.values(cart);

  if (items.length === 0) {
    showOrderMessage("Cart is empty");
    return;
  }

  const total = items.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );

  const address = document.getElementById("addressInput").value.trim();

  if (!address) {
    showOrderMessage("Please enter your address");
    return;
  }
console.log("SENDING ORDER:", {
  customer_id,
  items: Object.values(cart),
  total,
  address
});
  fetch(`${API_URL}/api/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
body: JSON.stringify({
  customer_id: customer_id,
  items: Object.values(cart), // 🔥 MUST be this
  total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  address: address
})
  })
    .then(async res => {
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Error");
  }

  return data;
})
.then(data => {
  // ✅ ANY success response is OK
  if (!data || !data.message) {
    showOrderMessage("Something went wrong");
    return;
  }

      localStorage.removeItem("cart");
      updateCartCount();
      showOrderMessage("Order placed successfully!");

      setTimeout(() => {
        window.location.href = "ordersuccess.html";
      }, 1500);
    })
    .catch(() => showOrderMessage("Server error"));
}

function showOrderMessage(text) {
  const msg = document.getElementById("orderMessage");
  if (!msg) return;

  msg.textContent = text;
  msg.style.display = "block";

  setTimeout(() => {
    msg.style.display = "none";
  }, 2000);
}

// Initial render
renderCart();
