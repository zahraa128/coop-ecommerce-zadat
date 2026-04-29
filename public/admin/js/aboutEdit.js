/**
 * aboutEdit.js
 * -------------
 * Edit About Us content (admin)
 */

const contentField = document.getElementById("content");
const message = document.getElementById("message");

// Load existing content
fetch("/api/admin/about")
  .then(res => res.json())
  .then(data => {
    contentField.value = data.content;
  })
  .catch(() => {
    message.style.color = "red";
    message.textContent = "Failed to load content.";
  });

// Update content
document.getElementById("aboutForm").addEventListener("submit", e => {
  e.preventDefault();

  fetch("/api/admin/about", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      content: contentField.value
    })
  })
    .then(res => res.json())
    .then(data => {
      message.style.color = "green";
      message.textContent = "✅ About Us updated successfully.";
    })
    .catch(() => {
      message.style.color = "red";
      message.textContent = "Update failed.";
    });
});
