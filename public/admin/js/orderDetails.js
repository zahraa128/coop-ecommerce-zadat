const params = new URLSearchParams(window.location.search);
const id = params.get("id");

fetch(`${API_URL}/api/admin/orders/${id}`)
  .then(res => res.json())
  .then(data => {
    const { order, items } = data;

    const info = document.getElementById("orderInfo");
    const tbody = document.getElementById("itemsTable");

    info.innerHTML = `
      <div class="order-card">
        <p><strong>Name:</strong> ${order.customer_name}</p>
        <p><strong>Phone:</strong> ${order.phone}</p>
        <p><strong>Address:</strong> ${order.address}</p>
        <p><strong>Total:</strong> $${order.total}</p>
      </div>
    `;

    tbody.innerHTML = "";

    items.forEach(i => {
      const total = i.quantity * i.price;

      tbody.innerHTML += `
        <tr>
          <td>${i.products?.name || "-"}</td>
          <td>${i.quantity}</td>
          <td>${i.price}</td>
          <td>${total}</td>
        </tr>
      `;
    });
  })
  .catch(() => {
    alert("Failed to load order details");
  });