/**
 * deliveredOrders.js
 * -------------------
 * Displays delivered orders
 */

const tableBody = document.querySelector("#deliveredOrdersTable tbody");

function loadDeliveredOrders() {
  fetch("/api/admin/orders/delivered")
    .then(res => res.json())
    .then(orders => {
      tableBody.innerHTML = "";

      if (orders.length === 0) {
        tableBody.innerHTML =
          `<tr><td colspan="8">No delivered orders found.</td></tr>`;
        return;
      }

      orders.forEach(o => {
        const price = Number(o.price) || 0;
        const total = (price * o.quantity).toFixed(2);

        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${o.o_id}</td>
          <td>${o.full_name}</td>
          <td>${o.phone}</td>
          <td>${o.product_name}</td>
          <td>${price.toFixed(2)}</td>
          <td>${o.quantity}</td>
          <td>${total}</td>
          <td>${new Date(o.order_date).toLocaleString()}</td>
        `;
        tableBody.appendChild(row);
      });
    })
    .catch(() => {
      tableBody.innerHTML =
        `<tr><td colspan="8">Failed to load delivered orders.</td></tr>`;
    });
}

loadDeliveredOrders();
