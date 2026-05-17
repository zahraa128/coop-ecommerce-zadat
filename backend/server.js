const express = require("express");
const cors = require("cors");

require("dotenv").config();

const app = express();
const visitRoutes = require("./routes/visits");
app.use(cors());
app.use(express.json());

/* ===== STATIC FRONTEND ===== */
app.use(express.static("public"));
app.use("/src/assets", express.static("src/assets"));

/* ===== SERVE IMAGES ===== */
app.use("/product", express.static("public/product"));

/* ===== ADMIN ROUTES ===== */
app.use("/api/admin", require("./routes/adminAuth"));
app.use("/api/admin", require("./routes/adminProducts"));
app.use("/api/admin", require("./routes/adminCategories"));
app.use("/api/admin", require("./routes/adminAbout"));
app.use("/api/admin", require("./routes/adminContact"));
app.use("/api/admin", require("./routes/adminOrders"));

/* ===== CUSTOMER ROUTES ===== */
app.use("/api", require("./routes/products"));
app.use("/api", require("./routes/checkout"));
app.use("/api", require("./routes/cart"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api", require("./routes/customerAuth"));
app.use("/api", require("./routes/customerOrders"));
app.use("/api/visits", visitRoutes);

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
