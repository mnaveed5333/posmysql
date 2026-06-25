import db from "@/lib/db";
import { NextResponse } from "next/server";

// PUT update category
export async function PUT(req, { params }) {
  try {
    const { name } = await req.json();
    
    // 1. Await params to unwrap the Promise safely
    const resolvedParams = await params; 
    const id = resolvedParams.id;

    await db.query("UPDATE categories SET name = ? WHERE id = ?", [
      name,
      id,
    ]);
    
    return NextResponse.json({ message: "Updated" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(_, { params }) {
  try {
    // 2. Await params here as well
    const resolvedParams = await params;
    const id = resolvedParams.id;

    await db.query("DELETE FROM categories WHERE id = ?", [id]);
    
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}