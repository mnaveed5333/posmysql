"use client";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

const categoryEmoji = {
  Burgers: "🍔",
  Pizza: "🍕",
  Drinks: "🥤",
  Desserts: "🍰",
  Snacks: "🍟",
  Default: "🍽️",
};

export default function ProductGrid({ products }) {
  const { addToCart } = useCart();

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product) => {
        const outOfStock = product.stock <= 0;

        return (
          <div
            key={product.id}
            onClick={() => {
              if (outOfStock) return;
              addToCart(product);
              toast.success(`${product.name} added!`);
            }}
            className={`bg-white rounded-2xl shadow transition-all p-4 flex flex-col items-center text-center relative
              ${outOfStock
                ? "opacity-50 cursor-not-allowed grayscale"
                : "hover:shadow-md cursor-pointer hover:scale-105"
              }`}
          >
            {/* Out of Stock Badge */}
            {outOfStock && (
              <span className="absolute top-2 right-2 text-[10px] font-bold bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                Out of Stock
              </span>
            )}

            <div className="text-5xl mb-3">
              {categoryEmoji[product.category] || categoryEmoji.Default}
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">{product.name}</h3>
            <p className="text-orange-500 font-bold text-sm mt-1">
              Rs. {product.price}
            </p>
            <span className="text-xs text-gray-400 mt-1 bg-gray-100 px-2 py-0.5 rounded-full">
              {product.category}
            </span>
            <span
              className={`text-xs mt-2 font-semibold ${
                product.stock > 5
                  ? "text-green-500"
                  : product.stock > 0
                  ? "text-yellow-500"
                  : "text-red-400"
              }`}
            >
              {outOfStock ? "Unavailable" : `Stock: ${product.stock}`}
            </span>
          </div>
        );
      })}
    </div>
  );
}