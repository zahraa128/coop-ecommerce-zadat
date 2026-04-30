(function () {
  function initCategoryInsertForm() {
    const form = document.getElementById("categoryForm");

    if (!form) {
      console.error("Category insert form not found");
      return;
    }

    if (form.dataset.bound === "true") {
      return;
    }

    form.dataset.bound = "true";

    form.addEventListener("submit", async e => {
      e.preventDefault();
      e.stopPropagation();
      console.log("FORM SUBMITTED");

      const token = localStorage.getItem("token");
      const name = document.querySelector("#categoryName").value.trim();

      if (!name) {
        alert("Category name is required");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/admin/categories`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": token
          },
          body: JSON.stringify({ name })
        });

        const data = await res.json();
        console.log("CATEGORY INSERT RESPONSE:", data);

        if (data.success) {
          alert("Category added successfully");
          window.location.href = "/admin/categories.html";
        } else {
          alert(data.error || data.message || "Insert failed");
        }
      } catch (err) {
        console.error("Category insert request failed:", err);
        alert("Server error");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCategoryInsertForm);
  } else {
    initCategoryInsertForm();
  }
})();
