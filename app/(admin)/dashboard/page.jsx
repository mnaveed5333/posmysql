"use client";
import { useEffect, useState } from "react";
import {
  FiShoppingBag,
  FiList,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch("/api/dashboard")
      .then((r) => r.json())
      .then(setStats);
  }, []);

  const cards = stats
    ? [
        {
          label: "Total Products",
          value: stats.totalProducts,
          icon: FiShoppingBag,
          color: "bg-blue-50 text-blue-500",
        },
        {
          label: "Total Orders",
          value: stats.totalOrders,
          icon: FiList,
          color: "bg-purple-50 text-purple-500",
        },
        {
          label: "Today's Sales",
          value: `Rs. ${stats.todaySales}`,
          icon: FiTrendingUp,
          color: "bg-green-50 text-green-500",
        },
        {
          label: "Low Stock Items",
          value: stats.lowStock,
          icon: FiAlertCircle,
          color: "bg-red-50 text-red-500",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats === null
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow animate-pulse h-24"
                />
              ))
          : cards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl p-5 shadow flex items-center gap-4"
              >
                <div className={`p-3 rounded-xl ${card.color}`}>
                  <card.icon size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 font-semibold">
                    {card.label}
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {card.value}
                  </p>
                </div>
              </div>
            ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow p-5">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Orders</h2>
        {stats?.recentOrders?.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-6">
            No orders yet
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-gray-400 text-xs uppercase">
              <tr>
                <th className="text-left pb-3">Order ID</th>
                <th className="text-left pb-3">Payment</th>
                <th className="text-left pb-3">Total</th>
                <th className="text-left pb-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentOrders?.map((order) => (
                <tr key={order.id} className="border-t">
                  <td className="py-2 text-gray-600">#{order.id}</td>
                  <td className="py-2 capitalize text-gray-500">
                    {order.payment_method}
                  </td>
                  <td className="py-2 text-orange-500 font-bold">
                    Rs. {order.total}
                  </td>
                  <td className="py-2 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}