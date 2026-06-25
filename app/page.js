"use client";
import { useState, useEffect } from "react";
import ProductGrid from "@/components/pos/ProductGrid";
import CartPanel from "@/components/pos/CartPanel";
import { FiSearch } from "react-icons/fi";

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setProducts(data);
      });

    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data))
          setCategories(["All", ...data.map((c) => c.name)]);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory =
      selectedCategory === "All" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 bg-white shadow-sm flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-orange-500">🍔 FoodPOS</h1>
          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 flex-1 max-w-sm gap-2">
            <FiSearch className="text-black" />
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-sm text-black
               outline-none w-full"
            />
          </div>
          <p className="text-sm text-black">Cashier: Admin</p>
        </div>

        <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-white border-b">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto">
          <ProductGrid products={filtered} />
        </div>
      </div>

      <div className="w-80 p-4">
        <CartPanel />
      </div>
    </div>
  );
}