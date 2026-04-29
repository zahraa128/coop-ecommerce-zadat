const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const db = require("./connect"); // This line makes connect.js run

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(cors());
}
app.use(express.json());

// static files if needed
app.use("/product", express.static("public/product"));
app.use(express.static(path.join(__dirname, "..", "public")));

// routes
const adminAuthRoutes = require("./routes/adminAuth");
const adminProductsRoutes = require("./routes/adminProducts");
const adminCategoriesRoutes = require("./routes/adminCategories");
const adminAboutRoutes = require("./routes/adminAbout");
const adminContactRoutes = require("./routes/adminContact");
const adminOrdersRoutes = require("./routes/adminOrders");
const productsRoutes = require("./routes/products");
const checkoutRoutes = require("./routes/checkout");
const cartRoutes = require("./routes/cart");
const authRoutes = require("./routes/auth");
const customerAuthRoutes = require("./routes/customerAuth");
const customerOrdersRoutes = require("./routes/customerOrders");
const visitsRoutes = require("./routes/visits");

app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api", adminProductsRoutes);
app.use("/api", adminCategoriesRoutes);
app.use("/api", adminAboutRoutes);
app.use("/api", adminContactRoutes);
app.use("/api", adminOrdersRoutes);
app.use("/api", productsRoutes);
app.use("/api", checkoutRoutes);
app.use("/api", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api", customerAuthRoutes);
app.use("/api", customerOrdersRoutes);
app.use("/api", visitsRoutes);

// Fallback to frontend
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});
