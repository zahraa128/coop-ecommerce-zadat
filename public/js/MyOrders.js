const customerId = localStorage.getItem("customer_id");

if (!customerId) {
  window.location.href = "login_user.html";
}

fetch(`${API_URL}/api/my-orders/${customerId}`)
  .then(res => res.json())
  .then(orders => {
    const container = document.getElementById("ordersContainer");

    if (!orders.length) {
      container.innerHTML = "<p>No orders yet.</p>";
      return;
    }

    orders.forEach(order => {
      const div = document.createElement("div");
      div.className = "order-box";

      div.innerHTML = `
        <p><strong>Order #${order.id}</strong></p>
        <p>Total: $${order.total}</p>
        <p>Status: ${order.status}</p>
      `;

      container.appendChild(div);
    });
  })
  .catch(() => {
    document.getElementById("ordersContainer").innerHTML =
      "<p>Failed to load orders</p>";
  });