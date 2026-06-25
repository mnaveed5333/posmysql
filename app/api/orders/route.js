import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET all orders
export async function GET() {
  try {
    const [orders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC"
    );

    // Get items for each order
    for (let order of orders) {
      const [items] = await db.query(
        `SELECT oi.*, p.name AS product_name
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    return NextResponse.json(orders);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST create new order
export async function POST(req) {
  try {
    const { items, total, payment_method, customer_name, cash_given } =
      await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in order" }, { status: 400 });
    }

    // Create order
    const [orderResult] = await db.query(
      "INSERT INTO orders (total, payment_method, customer_name, cash_given) VALUES (?, ?, ?, ?)",
      [
        total,
        payment_method,
        customer_name || null,
        payment_method === "cash" ? cash_given || null : null,
      ]
    );

    const orderId = orderResult.insertId;

    // Insert order items + deduct stock
    for (const item of items) {
      await db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, item.id, item.quantity, item.price]
      );

      // Deduct stock
      await db.query(
        "UPDATE products SET stock = stock - ? WHERE id = ?",
        [item.quantity, item.id]
      );
    }

    return NextResponse.json({ orderId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}