"use client";
import { useEffect, useState } from "react";
import { X, Package, CreditCard, Receipt, User, Banknote } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
        <span className="text-sm text-gray-400">
          {orders.length} {orders.length === 1 ? "order" : "orders"}
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 uppercase text-xs">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Items</th>
              <th className="px-4 py-3 text-left">Total</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left"></th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-300 text-sm">
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading &&
              orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setSelected(order)}
                  className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-700">
                    #{order.id}
                  </td>
                  <td className="px-4 py-3 capitalize text-gray-500">
                    {order.payment_method}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {order.items?.length || 0}
                  </td>
                  <td className="px-4 py-3 text-orange-500 font-bold">
                    Rs. {order.total}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="text-xs bg-orange-50 text-orange-500 px-3 py-1 rounded-lg font-semibold">
                      View
                    </span>
                  </td>
                </tr>
              ))}

            {!loading && orders.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-300 text-sm">
                  No orders yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Slide-over Order Details */}
      {selected && (
        <>
          {/* Backdrop */}
          <div
            onClick={() => setSelected(null)}
            className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white shadow-2xl z-50 flex flex-col animate-in slide-in-from-right">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">
                  Order #{selected.id}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {/* Customer card */}
              <div className="bg-gray-50 rounded-xl p-3 mb-3">
                <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                  <User size={12} />
                  Customer
                </div>
                <p className="text-sm font-semibold text-gray-700">
                  {selected.customer_name || "Walk-in customer"}
                </p>
              </div>

              {/* Summary cards */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <CreditCard size={12} />
                    Payment
                  </div>
                  <p className="text-sm font-semibold text-gray-700 capitalize">
                    {selected.payment_method}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                    <Receipt size={12} />
                    Total
                  </div>
                  <p className="text-sm font-semibold text-orange-500">
                    Rs. {selected.total}
                  </p>
                </div>
              </div>

              {/* Cash given / change — only for cash orders */}
              {selected.payment_method === "cash" && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                      <Banknote size={12} />
                      Cash Given
                    </div>
                    <p className="text-sm font-semibold text-gray-700">
                      Rs. {selected.cash_given ?? "—"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mb-1">
                      <Banknote size={12} />
                      Change Returned
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      Rs.{" "}
                      {selected.cash_given != null
                        ? (selected.cash_given - selected.total).toFixed(0)
                        : "—"}
                    </p>
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="flex items-center gap-1.5 text-gray-700 font-semibold text-sm mb-3">
                <Package size={14} />
                Items ({selected.items?.length || 0})
              </div>

              <div className="space-y-3">
                {selected.items?.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border rounded-xl px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        {item.product_name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Qty {item.quantity} × Rs. {item.price}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-orange-500">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>
                ))}

                {(!selected.items || selected.items.length === 0) && (
                  <p className="text-center text-gray-300 text-sm py-6">
                    No items found for this order
                  </p>
                )}
              </div>
            </div>

            {/* Footer total */}
            <div className="border-t px-6 py-4 flex items-center justify-between">
              <span className="text-sm text-gray-500">Order Total</span>
              <span className="text-lg font-bold text-orange-500">
                Rs. {selected.total}
              </span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}