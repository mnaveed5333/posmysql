import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET single product
export async function GET(_, { params }) {
  try {
    const { id } = await params;

    const [rows] = await db.query(
      `SELECT p.*, c.name AS category
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.id = ?`,
      [id]
    );
    if (rows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(rows[0]);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT update product
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const { name, price, stock, category_id } = await req.json();

    if (!name || !price || !stock || !category_id) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    const [result] = await db.query(
      "UPDATE products SET name = ?, price = ?, stock = ?, category_id = ? WHERE id = ?",
      [name, price, stock, category_id, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE product
export async function DELETE(_, { params }) {
  try {
    const { id } = await params;
    await db.query("DELETE FROM products WHERE id = ?", [id]);
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}