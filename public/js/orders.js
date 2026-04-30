document.getElementById("placeOrderBtn")?.addEventListener("click", async () => {
  const customer_id = localStorage.getItem("customer_id");

  if (!customer_id) {
    alert("Please login first");
    window.location.href = "login_user.html";
    return;
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || {};
  const items = Object.values(cart);

  if (items.length === 0) {
    alert("Cart is empty");
    return;
  }

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const address = prompt("Enter your delivery address:");
  if (!address) return;

  try {
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

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Order failed");
      return;
    }

    localStorage.removeItem("cart");
    window.location.href = "orders_success.html";

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
});