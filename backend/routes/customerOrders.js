const express = require("express");
const supabase = require("../supabase");

const router = express.Router();
router.get("/orders", async (req, res) => {
  const customerId = req.query.customer_id;

  if (!customerId) {
    return res.status(400).json({ message: "Missing customer_id" });
  }

  try {
    const { data: orders, error: ordersError } = await supabase
      .from("orders")
      .select("*")
      .eq("customers_id", customerId)
      .order("order_date", { ascending: false });

    if (ordersError) throw ordersError;
    if (orders.length === 0) return res.json([]);

    const productIds = [...new Set(orders.map(o => o.product_id).filter(Boolean))];
    const { data: products, error: productsError } = productIds.length
      ? await supabase
        .from("products")
        .select("p_id, name, price")
        .in("p_id", productIds)
      : { data: [], error: null };

    if (productsError) throw productsError;

    const productById = Object.fromEntries(products.map(p => [p.p_id, p]));

    res.json(orders.map(order => {
      const product = productById[order.product_id] || {};
      return {
        ...order,
        product_name: product.name || null,
        price: product.price || null
      };
    }));
  } catch {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});
router.get("/my-orders/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", customer_id)
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

module.exports = router;
