fetch(`${API_URL}/api/admin/contact`)
  .then(res => res.json())
  .then(data => {
    document.getElementById("phone").textContent = data.phone || "";
    document.getElementById("whatsapp").href = data.whatsapp || "#";
    document.getElementById("instagram").href = data.instagram || "#";
    document.getElementById("messenger").href = data.messenger || "#";
  })
  .catch(() => {
    console.error("Failed to load contact info");
  });