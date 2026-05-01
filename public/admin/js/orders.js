(() => {
const adminToken = localStorage.getItem("token");

if (!adminToken) {
  window.location.href = "/admin/login.html";
}

const tableBody = document.querySelector("#ordersTable tbody");

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

          <!-- ✅ NUMBER OF PRODUCTS -->
          <td>${o.products_count || 0} items</td>

          <!-- ❌ removed unit price -->
          <!-- ❌ removed quantity -->

          <td>${o.total}</td>

          <td>${new Date(o.created_at).toLocaleString()}</td>

          <!-- ✅ STATUS CONTROL -->
          <td>
            <select class="status-select" data-id="${o.id}">
              <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="shipping" ${o.status === "shipping" ? "selected" : ""}>Shipping</option>
              <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
              <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>

          <!-- ✅ VIEW ORDER BUTTON -->
          <td>
            <button class="view-btn" data-id="${o.id}">View</button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      // ===== STATUS UPDATE =====
      document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", () => {
          const id = select.dataset.id;
          const status = select.value;

          fetch(`${API_URL}/api/admin/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
          })
          .then(() => {
            // Optional: reload or just keep
          })
          .catch(() => alert("Failed to update status"));
        });
      });

      // ===== VIEW ORDER =====
      document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          window.location.href = `order-details.html?id=${id}`;
        });
      });

    })
    .catch(() => {
      tableBody.innerHTML =
        `<tr><td colspan="10">Failed to load orders</td></tr>`;
    });
}

// Load
loadOrders();
})();