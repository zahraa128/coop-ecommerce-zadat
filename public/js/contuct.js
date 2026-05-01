fetch(`${API_URL}/api/admin/contact`)
  .then(res => res.json())
  .then(data => {
    setLink("whatsapp", formatWhatsApp(data.whatsapp));
    setLink("instagram", data.instagram);
    setLink("messenger", data.messenger);
  })
  .catch(() => {
    console.error("Failed to load contact info");

    // ✅ fallback links (so buttons are always clickable)
    setLink("whatsapp", "https://wa.me/96100000000");
    setLink("instagram", "https://instagram.com");
    setLink("messenger", "https://m.me");
  });

function setLink(id, url) {
  const el = document.getElementById(id);
  if (!el) return;

  if (!url || url === "#") {
    el.style.opacity = "0.6";
    el.style.pointerEvents = "none";
    return;
  }

  el.href = url;
}

/* 🔥 Fix WhatsApp formatting */
function formatWhatsApp(phone) {
  if (!phone) return null;

  // remove spaces + "+"
  const clean = phone.replace(/\D/g, "");

  return `https://wa.me/${clean}`;
}