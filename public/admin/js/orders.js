(() => {
const adminToken = localStorage.getItem("token");

if (!adminToken) {
  window.location.href = "/admin/login.html";
}

const tableBody = document.querySelector("#ordersTable tbody");
const form = document.getElementById("filterForm");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

// 🔥 LOAD ORDERS WITH FILTER
function loadOrders() {
  const search = searchInput.value.trim();
  const sort = sortSelect.value;

  let url = `${API_URL}/api/admin/orders?sort=${sort}`;

  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(orders => {
      tableBody.innerHTML = "";

      if (!orders.length) {
        tableBody.innerHTML =
          `<tr><td colspan="9">No orders found.</td></tr>`;
        return;
      }

      orders.forEach(o => {
        const row = document.createElement("tr");

        row.innerHTML = `
          <td>${o.id}</td>
          <td>${o.customer_name || ""}</td>
          <td>${o.phone || ""}</td>
          <td>${o.products_count || 0} items</td>
          <td>${o.total}</td>
          <td>${new Date(o.created_at).toLocaleString()}</td>

          <td>
            <select class="status-select" data-id="${o.id}">
              <option value="pending" ${o.status === "pending" ? "selected" : ""}>Pending</option>
              <option value="shipping" ${o.status === "shipping" ? "selected" : ""}>Shipping</option>
              <option value="delivered" ${o.status === "delivered" ? "selected" : ""}>Delivered</option>
              <option value="cancelled" ${o.status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>

          <td>
            <a href="order-details.html?id=${o.id}">
              <button>View</button>
            </a>
          </td>

          <td>
            <button class="delete-btn" data-id="${o.id}">Delete</button>
          </td>
        `;

        tableBody.appendChild(row);
      });

      // STATUS UPDATE
      document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", () => {
          fetch(`${API_URL}/api/admin/orders/${select.dataset.id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: select.value })
          });
        });
      });

      // DELETE
      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
          const id = btn.dataset.id;

          if (!confirm("Delete this order?")) return;

          try {
            const res = await fetch(`${API_URL}/api/admin/orders/${id}`, {
              method: "DELETE"
            });

            if (!res.ok) throw new Error();

            loadOrders();

          } catch {
            alert("Delete failed");
          }
        });
      });

    });
}

// 🔥 FILTER FORM
form.addEventListener("submit", e => {
  e.preventDefault();
  loadOrders();
});

// 🔥 INITIAL LOAD
loadOrders();
})();