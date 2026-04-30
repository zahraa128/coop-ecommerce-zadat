const container = document.getElementById("aboutContent");

fetch(`${API_URL}/api/admin/about`)
  .then(res => res.json())
  .then(data => {
    container.textContent = data.content || "No content available.";
  })
  .catch(() => {
    container.textContent = "Failed to load content.";
  });