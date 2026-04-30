(() => {
  const API_URL = "https://coop-backend-hecq.onrender.com";

  const adminToken = localStorage.getItem("token");
  if (!adminToken) {
    window.location.href = "/admin/login.html";
  }

  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");

  const message = document.getElementById("message");
  const categorySelect = document.getElementById("categorySelect");

  if (!productId) {
    window.location.href = "products_list.html";
  }

  /* ===== LOAD CATEGORIES ===== */
  fetch(`${API_URL}/api/admin/categories`)
    .then(res => res.json())
    .then(categories => {
      categories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.name;   // ✅ IMPORTANT
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      });
    })
    .catch(err => {
      console.error("Category load error:", err);
    });

  /* ===== LOAD PRODUCT ===== */
  fetch(`${API_URL}/api/admin/products/${productId}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("name").value = p.name;
      document.getElementById("price").value = p.price;
      document.getElementById("description").value = p.description;

      // ✅ FIX CATEGORY
      categorySelect.value = p.category;

      // ✅ FIX IMAGE PATH
      document.getElementById("currentImage").src =
        `${API_URL}/product/${p.image}`;
    })
    .catch(err => {
      console.error("Product load error:", err);
    });

  /* ===== UPDATE PRODUCT ===== */
  document.getElementById("editProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Authorization": adminToken
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "products_list.html?updated=true";
      } else {
        message.style.color = "red";
        message.textContent = data.message || "Update failed";
      }

    } catch (err) {
      console.error(err);
      message.style.color = "red";
      message.textContent = "Server error.";
    }
  });
})();