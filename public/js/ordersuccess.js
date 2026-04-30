// Load header
fetch("header.html")
  .then(res => res.text())
  .then(data => document.getElementById("header").innerHTML = data);

// Load footer
fetch("footer.html")
  .then(res => res.text())
  .then(data => document.getElementById("footer").innerHTML = data);

// Optional message
const msg = document.getElementById("successMessage");
if (msg) {
  msg.textContent = "Your order has been placed successfully!";
}