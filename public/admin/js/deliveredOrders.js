(() => {
/**
 * deliveredOrders.js
 * -------------------
 * Displays delivered orders
 */
const adminToken = localStorage.getItem("token");

if (!adminToken) {
  window.location.href = "/admin/login.html";
}

const tableBody = document.querySelector("#deliveredOrdersTable tbody");

function loadDeliveredOrders() {
  fetch(`${API_URL}/api/admin/orders/delivered`)
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
  <td>${o.id}</td>
  <td>${o.customer_name || ""}</td>
  <td>${o.phone || ""}</td>
  <td>${o.products_count ?? 0} items</td>
  <td>${o.total ?? 0}</td>
  <td>${o.created_at ? new Date(o.created_at).toLocaleString() : ""}</td>
  <td>${o.status || ""}</td>
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
})();
