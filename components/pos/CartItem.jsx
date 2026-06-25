"use client";
import { useCart } from "@/context/CartContext";
import { FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-800">{item.name}</p>
        <p className="text-xs text-orange-500">Rs. {item.price}</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-6 h-6 rounded-full text-white bg-orange-400  flex items-center justify-center hover:bg-orange-600 cursor-pointer"
        >
          <FiMinus size={12} />
        </button>
        <span className="text-sm font-bold w-5 text-black">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-6 h-6 rounded-full text-white bg-orange-400 flex items-center justify-center hover:bg-orange-600 cursor-pointer"
        >
          <FiPlus size={12} />
        </button>
      </div>

      <p className="text-sm font-bold text-gray-800 w-16 text-right">
        Rs. {item.price * item.quantity}
      </p>

      <button
        onClick={() => removeFromCart(item.id)}
        className="ml-3 text-red-400 cursor-pointer hover:text-red-600"
      >
        <FiTrash2 size={14} />
      </button>
    </div>
  );
}