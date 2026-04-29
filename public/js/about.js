/**
 * about.js
 * ---------
 * Loads header and footer for About Us page
 */

// Load header
fetch("header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data);

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);
