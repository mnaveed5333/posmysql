import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [[{ totalProducts }]] = await db.query(
      "SELECT COUNT(*) AS totalProducts FROM products"
    );

    const [[{ totalOrders }]] = await db.query(
      "SELECT COUNT(*) AS totalOrders FROM orders"
    );

    const [[{ todaySales }]] = await db.query(`
      SELECT COALESCE(SUM(total), 0) AS todaySales
      FROM orders
      WHERE DATE(created_at) = CURDATE()
    `);

    const [[{ lowStock }]] = await db.query(
      "SELECT COUNT(*) AS lowStock FROM products WHERE stock <= 5"
    );

    const [recentOrders] = await db.query(
      "SELECT * FROM orders ORDER BY created_at DESC LIMIT 5"
    );

    return NextResponse.json({
      totalProducts,
      totalOrders,
      todaySales,
      lowStock,
      recentOrders,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}