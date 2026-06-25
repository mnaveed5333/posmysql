"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiGrid,
  FiShoppingBag,
  FiTag,
  FiList,
  FiBarChart2,
} from "react-icons/fi";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: FiGrid },
  { href: "/products", label: "Products", icon: FiShoppingBag },
  { href: "/categories", label: "Categories", icon: FiTag },
  { href: "/orders", label: "Orders", icon: FiList },
  { href: "/reports", label: "Reports", icon: FiBarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 bg-white shadow-sm flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b">
        <h1 className="text-xl font-bold text-orange-500">🍔 FoodPOS</h1>
        <p className="text-xs text-gray-400 mt-0.5">Admin Panel</p>
      </div>

      {/* Links */}
      <nav className="flex-1 p-4 flex flex-col gap-1">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
              pathname === href
                ? "bg-orange-500 text-white"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* POS Link */}
      <div className="p-4 border-t">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-500 font-semibold"
        >
          ← Go to POS
        </Link>
      </div>
    </div>
  );
}