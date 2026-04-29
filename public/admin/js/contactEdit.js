/**
 * contactEdit.js
 * ----------------
 * Edit contact info (admin)
 */

const message = document.getElementById("message");
const whatsapp = document.getElementById("whatsapp");
const instagram = document.getElementById("instagram");
const messenger = document.getElementById("messenger");

// Load existing contact info
fetch("/api/admin/contact")
  .then(res => res.json())
  .then(data => {
    whatsapp.value = data.whatsapp;
    instagram.value = data.instagram;
    messenger.value = data.messenger;
  })
  .catch(() => {
    message.style.color = "red";
    message.textContent = "Failed to load contact info.";
  });

// Update contact info
document.getElementById("contactForm").addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/admin/contact", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      whatsapp: whatsapp.value,
      instagram: instagram.value,
      messenger: messenger.value
    })
  })
    .then(res => res.json())
    .then(() => {
      message.style.color = "green";
      message.textContent = "✅ Contact info updated successfully.";
    })
    .catch(() => {
      message.style.color = "red";
      message.textContent = "❌ Update failed.";
    });
});
