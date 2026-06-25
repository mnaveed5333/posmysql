import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total quantity sold per product over the last 30 days (for ranking)
    const [topProducts] = await db.query(`
      SELECT
        p.id,
        p.name,
        SUM(oi.quantity) AS total_qty
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY p.id, p.name
      ORDER BY total_qty DESC
      LIMIT 5
    `);

    if (topProducts.length === 0) {
      return NextResponse.json([]);
    }

    const topProductIds = topProducts.map((p) => p.id);

    // Daily quantity sold for those top products, last 30 days
    const [dailyRows] = await db.query(
      `
      SELECT
        DATE(o.created_at) AS date,
        p.id AS product_id,
        p.name AS product_name,
        SUM(oi.quantity) AS qty
      FROM order_items oi
      JOIN products p ON p.id = oi.product_id
      JOIN orders o ON o.id = oi.order_id
      WHERE o.created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        AND p.id IN (?)
      GROUP BY DATE(o.created_at), p.id, p.name
      ORDER BY date ASC
      `,
      [topProductIds]
    );

    // Reshape into: [{ date, "Product A": 5, "Product B": 3 }, ...]
    const grouped = {};
    for (const row of dailyRows) {
      const dateKey = row.date.toISOString
        ? row.date.toISOString().split("T")[0]
        : row.date;
      if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey };
      grouped[dateKey][row.product_name] = row.qty;
    }

    const chartData = Object.values(grouped);

    return NextResponse.json({
      topProducts: topProducts.map((p) => p.name),
      chartData,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}