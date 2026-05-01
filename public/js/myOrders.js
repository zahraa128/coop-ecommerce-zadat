const customer_id = localStorage.getItem("customer_id");

if (!customer_id) {
  alert("Please login first");
  window.location.href = "login_user.html";
}

fetch(`${API_URL}/api/my-orders/${customer_id}`)
  .then(res => res.json())
  .then(orders => {
    const container = document.getElementById("ordersContainer");

    if (!orders.length) {
      container.innerHTML = "<p>No orders found</p>";
      return;
    }

    container.innerHTML = "";

    orders.forEach(o => {
      container.innerHTML += `
        <div class="order-card">
          <p><strong>Order ID:</strong> ${o.id}</p>
          <p><strong>Total:</strong> $${o.total}</p>
          <p><strong>Status:</strong> ${o.status}</p>
          <p><strong>Date:</strong> ${new Date(o.created_at).toLocaleString()}</p>
        </div>
      `;
    });
  })
  .catch(() => {
    alert("Failed to load orders");
  });