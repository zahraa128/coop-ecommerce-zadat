const textarea = document.getElementById("content");
const message = document.getElementById("message");

/* ===== LOAD ABOUT ===== */
async function loadAbout() {
  try {
    const res = await fetch(`${API_URL}/api/admin/about`);
    const data = await res.json();

    console.log("About data:", data);

    textarea.value = data?.content || "";
  } catch (err) {
    console.error(err);
  }
}

loadAbout();

/* ===== SAVE ===== */
document.getElementById("aboutForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const res = await fetch(`${API_URL}/api/admin/about`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({
        content: textarea.value
      })
    });

    const data = await res.json();

    console.log("Save response:", data);

    if (res.ok) {
      message.style.color = "green";
      message.textContent = "Saved successfully";
    } else {
      message.style.color = "red";
      message.textContent = data.message || "Save failed";
    }

  } catch (err) {
    console.error(err);
    message.textContent = "Server error";
  }
});