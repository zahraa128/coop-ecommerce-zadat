const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

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
app.use("/api", require("./routes/visits"));
app.use("/api", require("./routes/orders"));
app.use("/api", require("./routes/ordersuccess"));
app.use("/api", require("./routes/MyOrders"));

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = router;