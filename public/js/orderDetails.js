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

    // Order info
    document.getElementById("orderInfo").innerHTML = `
      <p><strong>Order ID:</strong> ${order.id}</p>
      <p><strong>Status:</strong> ${order.status}</p>
      <p><strong>Total:</strong> $${order.total}</p>
      <p><strong>Date:</strong> ${new Date(order.created_at).toLocaleString()}</p>
    `;

    const tbody = document.getElementById("itemsTable");
    tbody.innerHTML = "";

    items.forEach(i => {
      const total = i.quantity * i.price;

      tbody.innerHTML += `
        <tr>
          <td>${i.product_name}</td>
          <td>${i.quantity}</td>
          <td>$${i.price}</td>
          <td>$${total}</td>
        </tr>
      `;
    });
  })
  .catch(() => {
    alert("Failed to load order details");
  });