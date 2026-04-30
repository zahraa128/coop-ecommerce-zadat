(() => {
  const API_URL = "https://coop-backend-hecq.onrender.com";

  const adminToken = localStorage.getItem("token");

  if (!adminToken) {
    window.location.href = "/admin/login.html";
  }

  const form = document.getElementById("productForm");
  const message = document.getElementById("message");
  const categorySelect = document.getElementById("categorySelect");

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

  /* ===== SUBMIT PRODUCT ===== */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    try {
      const res = await fetch(`${API_URL}/api/admin/products`, {
        method: "POST",
        headers: {
          "Authorization": adminToken
        },
        body: formData
      });

      const data = await res.json();

      if (data.success) {
        message.style.color = "green";
        message.textContent = "✅ Product inserted successfully.";
        form.reset();
      } else {
        message.style.color = "red";
        message.textContent = data.message || "Insert failed";
      }

    } catch (err) {
      console.error(err);
      message.style.color = "red";
      message.textContent = "Server error.";
    }
  });
})();
