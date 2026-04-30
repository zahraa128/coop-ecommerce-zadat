/**
 * adminOrders.js
 * ---------------
 * Admin view orders with search & sort
 */
const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

async function getOrders({ status, search, ascending }) {
  let query = supabase
    .from("orders")
    .select("*")
    .order("order_date", { ascending });

  if (status) {
    query = query.eq("status", status);
  }

  const { data: orders, error: ordersError } = await query;
  if (ordersError) throw ordersError;
  if (orders.length === 0) return [];

  const customerIds = [...new Set(orders.map(o => o.customers_id).filter(Boolean))];
  const productIds = [...new Set(orders.map(o => o.product_id).filter(Boolean))];

  const [{ data: customers, error: customersError }, { data: products, error: productsError }] =
    await Promise.all([
      customerIds.length
        ? supabase.from("customers").select("c_id, full_name, phone").in("c_id", customerIds)
        : Promise.resolve({ data: [], error: null }),
      productIds.length
        ? supabase.from("products").select("p_id, name, price").in("p_id", productIds)
        : Promise.resolve({ data: [], error: null })
    ]);

  if (customersError) throw customersError;
  if (productsError) throw productsError;

  const customerById = Object.fromEntries(customers.map(c => [c.c_id, c]));
  const productById = Object.fromEntries(products.map(p => [p.p_id, p]));

  return orders
    .map(order => {
      const customer = customerById[order.customers_id] || {};
      const product = productById[order.product_id] || {};

      return {
        ...order,
        full_name: customer.full_name || null,
        phone: customer.phone || null,
        product_name: product.name || null,
        price: product.price || null
      };
    })
    .filter(order => !search || (order.full_name || "").toLowerCase().includes(search.toLowerCase()));
}

router.get("/orders", async (req, res) => {
  const ascending = req.query.sort === "oldest";
  const search = req.query.search || "";

  try {
    const orders = await getOrders({ search, ascending });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch orders." });
  }
});

router.get("/orders/delivered", async (req, res) => {
  try {
    const orders = await getOrders({ status: "delivered", ascending: false });
    res.json(orders);
  } catch {
    res.status(500).json({ message: "Failed to fetch delivered orders." });
  }
});

router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;
  const allowed = ["submitted", "shipping", "delivered", "cancelled"];

  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status." });
  }

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("o_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Status updated." });
  } catch {
    res.status(500).json({ message: "Failed to update status." });
  }
});

router.delete("/orders/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("o_id", req.params.id);

    if (error) throw error;
    res.json({ message: "Order deleted." });
  } catch {
    res.status(500).json({ message: "Failed to delete order." });
  }
});

module.exports = router;
