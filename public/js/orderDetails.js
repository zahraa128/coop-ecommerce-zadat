const params = new URLSearchParams(window.location.search);
const orderId = params.get("id");

if (!orderId) {
  alert("Invalid order");
  window.location.href = "orders.html";
}

fetch(`${API_URL}/api/admin/orders/${orderId}`)
  .then(res => res.json())
  .then(data => {
    const { order, items } = data;

    // ===== ORDER INFO =====
    document.getElementById("orderInfo").innerHTML = `
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${Number(order.total).toFixed(2)}</p>
      <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
    `;

    // ===== ITEMS (CARDS) =====
    const tbody = document.getElementById("itemsTable");
    tbody.innerHTML = "";

    items.forEach(i => {
      const total = (i.quantity * i.price).toFixed(2);

      tbody.innerHTML += `
        <div class="order-item-card">
          <p><strong>Product:</strong> ${i.product_name}</p>
          <p><strong>Quantity:</strong> ${i.quantity}</p>
          <p><strong>Price:</strong> $${Number(i.price).toFixed(2)}</p>
          <p><strong>Total:</strong> $${total}</p>
        </div>
      `;
    });
  })
  .catch(() => {
    alert("Failed to load order details");
  });