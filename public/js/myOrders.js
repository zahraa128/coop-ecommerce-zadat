const customer_id = localStorage.getItem("customer_id");

if (!customer_id) {
  window.location.href = "login_user.html";
}

fetch(`${API_URL}/api/my-orders/${customer_id}`)
  .then(res => res.json())
  .then(orders => {
    const container = document.getElementById("ordersContainer");

    if (!orders.length) {
      container.innerHTML = "<p>No orders found.</p>";
      return;
    }

    orders.forEach(order => {
      const div = document.createElement("div");

      div.innerHTML = `
        <h3>Order #${order.id}</h3>
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