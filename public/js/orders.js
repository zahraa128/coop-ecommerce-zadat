const cart = JSON.parse(localStorage.getItem("cart")) || {};
const items = Object.values(cart);

const total = items.reduce((sum, item) => 
  sum + item.price * item.quantity, 0
);

const address = prompt("Enter your delivery address:");
if (!address) return;

const res = await fetch(`${API_URL}/api/checkout`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    customer_id,
    items,
    total,
    address
  })
});