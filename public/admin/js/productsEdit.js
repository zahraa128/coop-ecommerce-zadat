(() => {
  const API_URL = "https://coop-backend-hecq.onrender.com";

  const productId = new URLSearchParams(window.location.search).get("id");
  const message = document.getElementById("message");
  const categorySelect = document.getElementById("categorySelect");

  if (!productId) {
    window.location.href = "products_list.html";
  }

  /* ===== LOAD CATEGORIES ===== */
  fetch(`${API_URL}/api/admin/categories`)
    .then(res => res.json())
    .then(data => {
      data.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        categorySelect.appendChild(opt);
      });
    });

  /* ===== LOAD PRODUCT ===== */
  fetch(`${API_URL}/api/admin/products/${productId}`)
    .then(res => res.json())
    .then(p => {
      document.getElementById("name").value = p.name || "";
      document.getElementById("price").value = p.price || "";
      document.getElementById("description").value = p.description || "";
      categorySelect.value = p.category_id || "";

      if (p.image) {
        document.getElementById("currentImage").src = p.image;
      }
    });

  /* ===== UPDATE ===== */
  document.getElementById("editProductForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    formData.append("name", form.name.value);
    formData.append("price", form.price.value);
    formData.append("description", form.description.value);
    formData.append("category_id", form.categorySelect.value);

    const file = form.image.files[0];
    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/products/${productId}`, {
        method: "PUT",
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        window.location.href = "products_list.html?updated=true";
      } else {
        message.textContent = data.message || "Update failed";
      }

    } catch (err) {
      console.error(err);
      message.textContent = "Server error";
    }
  });
})();