const customer_id = localStorage.getItem("customer_id");

if (!customer_id) {
  alert("Please login first");
  window.location.href = "login_user.html";
}

fetch(`${API_URL}/api/my-orders/${customer_id}`)
  .then(res => res.json())
  .then(orders => {
    const tbody = document.querySelector("#ordersTable tbody");

    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="7">No orders found</td></tr>`;
      return;
    }

    tbody.innerHTML = "";

    orders.forEach(o => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${o.id}</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>${o.total}</td>
        <td>${o.status}</td>
        <td>${new Date(o.created_at).toLocaleString()}</td>
      `;

      tbody.appendChild(row);
    });
  })
  .catch(() => alert("Failed to load orders"));