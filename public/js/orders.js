/**
 * orders.js
 * ----------
 * Shows customer orders and status
 */

const tableBody = document.querySelector("#ordersTable tbody");
const customerId = localStorage.getItem("customer_id");

if (!customerId) {
  tableBody.innerHTML =
    "<tr><td colspan=\"7\">Please login to view your orders.</td></tr>";
} else {
  fetch(`/api/orders?customer_id=${customerId}`)
    .then(res => res.json())
    .then(orders => {
      tableBody.innerHTML = "";

      if (orders.length === 0) {
        tableBody.innerHTML =
          "<tr><td colspan=\"7\">No orders found.</td></tr>";
        return;
      }

      orders.forEach(o => {
        const price = Number(o.price) || 0;
        const total = (price * o.quantity).toFixed(2);
        const status = o.status || "submitted";

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${o.o_id}</td>
          <td>${o.product_name}</td>
          <td>$${price.toFixed(2)}</td>
          <td>${o.quantity}</td>
          <td>$${total}</td>
          <td class="status ${status}">${status}</td>
          <td>${new Date(o.order_date).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(() => {
      tableBody.innerHTML =
        "<tr><td colspan=\"7\">Failed to load orders.</td></tr>";
    });
}
