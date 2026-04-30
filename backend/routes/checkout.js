router.post("/checkout", async (req, res) => {
  try {
    const { customer_id, items, total, address } = req.body;

    if (!customer_id || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // INSERT ORDER
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{
        customer_id,
        total,
        address,
        status: "pending"
      }])
      .select()
      .single();

    if (orderError) throw orderError;

    // INSERT ORDER ITEMS
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) throw itemsError;

    res.json({ message: "Order placed successfully" });

  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});