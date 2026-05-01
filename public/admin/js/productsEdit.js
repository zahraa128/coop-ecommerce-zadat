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
        opt.value = cat.id;
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
    console.log("Loaded product:", p);

    document.getElementById("name").value = p.name || "";
    document.getElementById("price").value = p.price || "";
    document.getElementById("description").value = p.description || "";

    // ✅ category fix
    document.getElementById("categorySelect").value = p.category_id || "";

    // ✅ image preview fix
    if (p.image) {
      document.getElementById("currentImage").src = p.image;
    }
  })
  .catch(err => console.error("Load product error:", err));

  /* ===== UPDATE PRODUCT ===== */
document.getElementById("editProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData();

  formData.append("name", form.name.value);
  formData.append("price", form.price.value);
  formData.append("description", form.description.value);
  formData.append("category_id", form.categorySelect.value);

  // ✅ only append image if selected
  const fileInput = form.querySelector('input[type="file"]');
  if (fileInput.files[0]) {
    formData.append("image", fileInput.files[0]);
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
      message.style.color = "red";
      message.textContent = data.message || "Update failed";
    }

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    message.textContent = "Server error.";
  }
});