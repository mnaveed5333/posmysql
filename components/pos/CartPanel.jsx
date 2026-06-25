"use client";
import { useCart } from "@/context/CartContext";
import CartItem from "./CartItem";
import { useState } from "react";
import CheckoutModal from "./CheckoutModal";

export default function CartPanel() {
  const { cart, total, clearCart } = useCart();
  const [showCheckout, setShowCheckout] = useState(false);

  return (
    <div className="w-full h-full bg-white flex flex-col rounded-2xl shadow-lg">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-800">Current Order</h2>
        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs text-red-400 hover:text-red-600"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto px-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <p className="text-4xl">🛒</p>
            <p className="mt-2 text-sm">No items added yet</p>
          </div>
        ) : (
          cart.map((item) => <CartItem key={item.id} item={item} />)
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
        <div className="flex justify-between mb-1 text-sm text-gray-500">
          <span>Items</span>
          <span>{cart.reduce((s, i) => s + i.quantity, 0)}</span>
        </div>
        <div className="flex justify-between mb-4 text-lg font-bold text-gray-800">
          <span>Total</span>
          <span className="text-orange-500">Rs. {total}</span>
        </div>
        <button
          disabled={cart.length === 0}
          onClick={() => setShowCheckout(true)}
          className="cursor-pointer w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-bold rounded-xl transition-all"
        >
          Proceed to Checkout
        </button>
      </div>

      {showCheckout && (
        <CheckoutModal onClose={() => setShowCheckout(false)} />
      )}
    </div>
  );
}