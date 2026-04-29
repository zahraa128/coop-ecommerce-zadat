/**
 * aboutView.js
 * -------------
 * Loads About Us content for admin
 */

fetch("/api/admin/about")
  .then(res => res.json())
  .then(data => {
    document.getElementById("aboutContent").innerHTML =
      data.content.replace(/\n/g, "<br>");
  })
  .catch(() => {
    document.getElementById("aboutContent").textContent =
      "Failed to load content.";
  });
