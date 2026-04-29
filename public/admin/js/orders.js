/**
 * orders.js
 * ----------
 * Handles admin orders view, search & sort
 */

const tableBody = document.querySelector("#ordersTable tbody");
const form = document.getElementById("filterForm");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");

function loadOrders() {
  const search = searchInput.value.trim();
  const sort = sortSelect.value;

  let url = `/api/admin/orders?sort=${sort}`;
  if (search) {
    url += `&search=${encodeURIComponent(search)}`;
  }

  fetch(url)
    .then(res => res.json())
    .then(orders => {
      tableBody.innerHTML = "";

      if (orders.length === 0) {
        tableBody.innerHTML =
          `<tr><td colspan="8">No orders found.</td></tr>`;
        return;
      }

      orders.forEach(o => {
        const price = Number(o.price) || 0;
        const total = (price * o.quantity).toFixed(2);

        const row = document.createElement("tr");
        const status = o.status || "submitted";
        row.innerHTML = `
          <td>${o.o_id}</td>
          <td>${o.full_name}</td>
          <td>${o.phone}</td>
          <td>${o.product_name}</td>
          <td>${price.toFixed(2)}</td>
          <td>${o.quantity}</td>
          <td>${total}</td>
          <td>${new Date(o.order_date).toLocaleString()}</td>
          <td>
            <select class="status-select" data-id="${o.o_id}">
              <option value="submitted" ${status === "submitted" ? "selected" : ""}>Submitted</option>
              <option value="shipping" ${status === "shipping" ? "selected" : ""}>Shipping</option>
              <option value="delivered" ${status === "delivered" ? "selected" : ""}>Delivered</option>
              <option value="cancelled" ${status === "cancelled" ? "selected" : ""}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="delete-btn" data-id="${o.o_id}">Delete</button>
          </td>
        `;
        tableBody.appendChild(row);
      });

      document.querySelectorAll(".status-select").forEach(select => {
        select.addEventListener("change", () => {
          const id = select.getAttribute("data-id");
          const status = select.value;
          fetch(`/api/admin/orders/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
          }).catch(() => alert("Failed to update status."));
        });
      });

      document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          if (!confirm("Delete this order?")) return;
          fetch(`/api/admin/orders/${id}`, {
            method: "DELETE"
          })
            .then(() => loadOrders())
            .catch(() => alert("Failed to delete order."));
        });
      });
    });
}

// Initial load
loadOrders();

// Filter submit
form.addEventListener("submit", e => {
  e.preventDefault();
  loadOrders();
});
