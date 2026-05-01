const express = require("express");
const router = express.Router();
const supabase = require("../supabase");

/* ===== GET ALL ORDERS (WITH PRODUCT COUNT) ===== */
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 🔹 ORDER
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    if (orderError) throw orderError;

    // 🔹 ORDER ITEMS + PRODUCTS
    const { data: items, error: itemsError } = await supabase
      .from("order_items")
      .select(`
        quantity,
        price,
        products (
          name
        )
      `)
      .eq("order_id", id);

    if (itemsError) throw itemsError;

    res.json({ order, items });

  } catch (err) {
    console.error("DETAIL ERROR:", err);
    res.status(500).json({ message: "Failed to load order details" });
  }
});

    // 🔥 attach product count
    const ordersWithCount = await Promise.all(
      orders.map(async (o) => {
        const { count } = await supabase
          .from("order_items")
          .select("*", { count: "exact", head: true })
          .eq("order_id", o.id);

        return {
          ...o,
          products_count: count || 0
        };
      })
    );

    res.json(ordersWithCount);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

/* ===== UPDATE STATUS ===== */
router.put("/orders/:id/status", async (req, res) => {
  const { status } = req.body;

  try {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", req.params.id);

    if (error) throw error;

    res.json({ message: "Status updated" });

  } catch (err) {
    res.status(500).json({ message: "Failed to update status" });
  }
});

/* ===== GET SINGLE ORDER DETAILS ===== */
router.get("/orders/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data: order } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();

    const { data: items } = await supabase
      .from("order_items")
      .select("quantity, price, products(name, category_id)")
      .eq("order_id", id);

    res.json({ order, items });

  } catch {
    res.status(500).json({ message: "Failed to load order" });
  }
});
/* ===== GET DELIVERED ORDERS ===== */
router.get("/orders/delivered", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("status", "delivered")
      .order("id", { ascending: false });

    if (error) throw error;

    res.json(data);

  } catch (err) {
    res.status(500).json({ message: "Failed to load delivered orders" });
  }
});

module.exports = router;