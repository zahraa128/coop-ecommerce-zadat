const aboutContent = document.getElementById("aboutContent");

async function loadAbout() {
  try {
    const res = await fetch(`${API_URL}/api/admin/about`);
    const data = await res.json();

    console.log("About view:", data);

    aboutContent.textContent = data?.content || "No content yet.";

  } catch (err) {
    console.error(err);
    aboutContent.textContent = "Failed to load content.";
  }
}

loadAbout();