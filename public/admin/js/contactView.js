/**
 * contactView.js
 * ----------------
 * Loads contact info for admin
 */

fetch("/api/admin/contact")
  .then(res => res.json())
  .then(data => {
    document.getElementById("whatsapp").textContent = data.whatsapp;
    document.getElementById("whatsapp").href = data.whatsapp;

    document.getElementById("instagram").textContent = data.instagram;
    document.getElementById("instagram").href = data.instagram;

    document.getElementById("messenger").textContent = data.messenger;
    document.getElementById("messenger").href = data.messenger;
  })
  .catch(() => {
    document.querySelector(".contact-links").textContent =
      "Failed to load contact info.";
  });
