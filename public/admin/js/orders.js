(() => {
const adminToken = localStorage.getItem("token");

if (!adminToken) {
  window.location.href = "/admin/login.html";
}

const tableBody = document.querySelector("#ordersTable tbody");
const form = document.getElementById("filterForm");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

function loadOrders() {
  fetch(`${API_URL}/api/admin/orders`)
    .then(res => res.json())
    .then(orders => {
      tableBody.innerHTML = "";

      if (!orders.length) {
        tableBody.innerHTML =
          `<tr><td colspan="10">No orders found.</td></tr>`;
        return;
      }

      orders.forEach(o => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${o.id}</td>
          <td>${o.customer_name || ""}</td>
          <td>${o.phone || ""}</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>${o.total}</td>
          <td>${new Date(o.created_at).toLocaleString()}</td>
          <td>${o.status}</td>
          <td>-</td>
        `;

        tableBody.appendChild(row);
      });
    })
    .catch(() => {
      tableBody.innerHTML =
        `<tr><td colspan="10">Failed to load orders</td></tr>`;
    });
}

// Initial load
loadOrders();

// Disable filter for now (since backend doesn’t support it yet)
form.addEventListener("submit", e => {
  e.preventDefault();
  loadOrders();
});
})();