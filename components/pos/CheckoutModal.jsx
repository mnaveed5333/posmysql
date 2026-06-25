"use client";
import { useState, useRef } from "react";
import { useCart } from "@/context/CartContext";
import toast from "react-hot-toast";

export default function CheckoutModal({ onClose }) {
  const { cart, total, clearCart } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [cashGiven, setCashGiven] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [savedCart, setSavedCart] = useState([]);
  const [savedTotal, setSavedTotal] = useState(0);
  const [savedCashGiven, setSavedCashGiven] = useState(0);
  const [savedCustomerName, setSavedCustomerName] = useState("");
  const receiptRef = useRef();

  const change = cashGiven ? parseFloat(cashGiven) - total : 0;

  const handleConfirm = async () => {
    if (paymentMethod === "cash" && parseFloat(cashGiven) < total) {
      toast.error("Cash given is less than total!");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          total,
          payment_method: paymentMethod,
          customer_name: customerName || null,
          cash_given: paymentMethod === "cash" ? parseFloat(cashGiven) || 0 : null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSavedCart([...cart]);
        setSavedTotal(total);
        setSavedCashGiven(paymentMethod === "cash" ? (parseFloat(cashGiven) || 0) : 0);
        setSavedCustomerName(customerName || "");
        setOrderId(data.orderId);
        setOrderDone(true);
        clearCart();
        toast.success("Order placed successfully!");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (err) {
      toast.error("Server error!");
    }
    setLoading(false);
  };

  const handlePrint = () => {
    const printContents = receiptRef.current.innerHTML;
    const win = window.open("", "_blank", "width=500,height=700");
    win.document.write(`
      <html>
        <head>
          <title>Receipt #${orderId}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Courier New', monospace;
              background: #fff;
              padding: 30px 40px;
              font-size: 14px;
              color: #000000;
              font-weight: 500;
            }
            .header { text-align: center; margin-bottom: 16px; color: #000000; }
            .header h1 { font-size: 26px; font-weight: 900; letter-spacing: 2px; color: #000000; }
            .header p { font-size: 13px; color: #000000; font-weight: 600; margin-top: 2px; }
            .divider-solid { border-top: 3px solid #000000; margin: 12px 0; }
            .divider-dashed { border-top: 2px dashed #000000; margin: 12px 0; }

            table.order-info-table { width: 100%; border-collapse: collapse; }
            table.order-info-table td { padding: 4px 0; font-size: 14px; color: #000000; }
            table.order-info-table td:first-child { font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 0.5px; }
            table.order-info-table td:last-child { text-align: right; font-weight: 700; }

            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            thead tr { border-bottom: 2px solid #000000; }
            thead td { font-weight: 900; padding: 6px 4px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; color: #000000; }
            tbody tr.item-row td { padding: 8px 4px; font-size: 14px; border-bottom: 1px dashed #000000; color: #000000; font-weight: 500; }

            .total-table-row td { padding: 8px 4px; font-size: 14px; color: #000000; font-weight: 600; }
            .total-table-row.grand-line td { font-size: 16px; font-weight: 900; border-top: 2px solid #000000; }
            .total-table-row.final-line td { border-bottom: 2px dashed #000000; padding-bottom: 12px; }

            .right { text-align: right; }
            .center { text-align: center; }
            .footer { text-align: center; margin-top: 20px; font-size: 13px; color: #000000; font-weight: 600; line-height: 1.8; }
            .footer .brand { font-size: 12px; color: #000000; font-weight: 700; margin-top: 10px; letter-spacing: 1px; text-transform: uppercase; }
          </style>
        </head>
        <body>${printContents}</body>
      </html>
    `);
    win.document.close();
    win.print();
  };

  if (orderDone) {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-PK", {
      year: "numeric", month: "long", day: "numeric"
    });
    const timeStr = now.toLocaleTimeString("en-PK", {
      hour: "2-digit", minute: "2-digit"
    });
    const savedChange = savedCashGiven > 0 ? savedCashGiven - savedTotal : 0;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl w-[420px] shadow-2xl max-h-[90vh] overflow-y-auto">

          {/* Receipt Wrapper */}
          <div ref={receiptRef} className="p-6 text-black">

            {/* Header */}
            <div className="header text-center mb-4">
              <h1 className="text-3xl font-black tracking-widest text-black">
                SEE&BITE
              </h1>
              <p className="text-sm text-black font-bold mt-1">Your Favorite Food Destination</p>
              <p className="text-sm text-black font-bold"> Islamabad, Pakistan</p>
            </div>

            {/* Solid divider */}
            <div className="divider-solid border-t-2 border-black my-3" />

            {/* Order Info - print-safe table layout */}
            <table className="order-info-table w-full text-sm mb-2">
              <tbody>
                <tr>
                  <td className="py-1 font-black text-black uppercase text-xs tracking-wide">Order #</td>
                  <td className="py-1 text-right font-black text-black text-base">{orderId}</td>
                </tr>
                {savedCustomerName && (
                  <tr>
                    <td className="py-1 font-black text-black uppercase text-xs tracking-wide">Customer</td>
                    <td className="py-1 text-right font-bold text-black">{savedCustomerName}</td>
                  </tr>
                )}
                <tr>
                  <td className="py-1 font-black text-black uppercase text-xs tracking-wide">Date</td>
                  <td className="py-1 text-right font-bold text-black">{dateStr}</td>
                </tr>
                <tr>
                  <td className="py-1 font-black text-black uppercase text-xs tracking-wide">Time</td>
                  <td className="py-1 text-right font-bold text-black">{timeStr}</td>
                </tr>
                <tr>
                  <td className="py-1 font-black text-black uppercase text-xs tracking-wide">Payment</td>
                  <td className="py-1 text-right font-bold text-black capitalize">{paymentMethod}</td>
                </tr>
              </tbody>
            </table>

            {/* Dashed divider */}
            <div className="divider-dashed border-t border-dashed border-black my-3" />

            {/* Items and Calculations Table */}
            <table className="w-full text-sm text-black">
              <thead>
                <tr className="border-b-2 border-black">
                  <td className="py-2 font-black uppercase text-xs tracking-wider text-black">Item</td>
                  <td className="py-2 font-black uppercase text-xs tracking-wider text-center text-black">Qty</td>
                  <td className="py-2 font-black uppercase text-xs tracking-wider text-right text-black">Rate</td>
                  <td className="py-2 font-black uppercase text-xs tracking-wider text-right text-black">Amount</td>
                </tr>
              </thead>
              <tbody>
                {/* Product Data Rows */}
                {savedCart.map((item) => (
                  <tr key={item.id} className="item-row border-b border-dashed border-black">
                    <td className="py-2 text-black font-semibold">{item.name}</td>
                    <td className="py-2 text-center text-black font-semibold">{item.quantity}</td>
                    <td className="py-2 text-right text-black font-semibold">Rs.{parseFloat(item.price).toFixed(0)}</td>
                    <td className="py-2 text-right font-black text-black">
                      Rs.{(item.price * item.quantity).toFixed(0)}
                    </td>
                  </tr>
                ))}

                {/* Calculations Nested Inside Product Table Structure */}
                <tr className="total-table-row grand-line">
                  <td colSpan="2" className="pt-4 font-black text-base text-black">TOTAL</td>
                  <td colSpan="2" className="pt-4 text-right font-black text-base text-black">
                    Rs. {savedTotal.toFixed(0)}
                  </td>
                </tr>

                {paymentMethod === "cash" && (
                  <>
                    <tr className="total-table-row">
                      <td colSpan="2" className="py-1 text-black font-semibold">Cash Given</td>
                      <td colSpan="2" className="py-1 text-right text-black font-semibold">
                        Rs. {savedCashGiven.toFixed(0)}
                      </td>
                    </tr>
                    <tr className="total-table-row final-line border-b-2 border-dashed border-black">
                      <td colSpan="2" className="py-1 pb-3 text-black font-black">Change</td>
                      <td colSpan="2" className="py-1 pb-3 text-right text-black font-black">
                        Rs. {savedChange.toFixed(0)}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>

            {/* Footer Elements */}
            <div className="footer text-center text-black mt-6">
              <p className="text-sm font-bold text-black"> Thank you for dining with us!</p>
              <p className="text-xs font-bold text-black mt-1">Please come again • See&Bite loves you!</p>
              <div className="border-t border-dashed border-black mt-4 pt-3">
                <p className="text-xs font-black tracking-widest uppercase text-black">
                  Prepared by SiteCraft
                </p>
              </div>
            </div>

          </div>

          {/* Interface Operations */}
          <div className="flex gap-3 px-6 pb-6">
            <button
              onClick={handlePrint}
              className="flex-1 py-2.5 cursor-pointer bg-black hover:bg-black/90 text-white rounded-xl font-bold text-sm"
            >
               Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm"
            >
              New Order
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl">
        <h2 className="text-lg font-bold text-black mb-4">Checkout</h2>

        <div className="mb-4">
          <label className="text-sm text-black font-bold">Customer Name</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Walk-in customer"
            className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black font-semibold focus:outline-none focus:border-orange-400"
          />
        </div>

        <div className="bg-gray-50 rounded-xl p-3 mb-4 max-h-40 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1 text-black font-semibold">
              <span>{item.name} x{item.quantity}</span>
              <span>Rs. {item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between font-bold text-black mb-4">
          <span>Total</span>
          <span className="text-orange-500">Rs. {total}</span>
        </div>

        <p className="text-sm font-bold text-black mb-2">Payment Method</p>
        <div className="flex gap-3 mb-4">
          {["cash", "card"].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`flex-1 py-2 rounded-xl border-2 font-bold text-sm capitalize transition-all ${
                paymentMethod === method
                  ? "border-orange-500 bg-orange-50 text-orange-500"
                  : "border-gray-200 text-black"
              }`}
            >
              {method === "cash" ? "💵 Cash" : "💳 Card"}
            </button>
          ))}
        </div>

        {paymentMethod === "cash" && (
          <div className="mb-4">
            <label className="text-sm text-black font-bold">Cash Given</label>
            <input
              type="number"
              value={cashGiven}
              onChange={(e) => setCashGiven(e.target.value)}
              placeholder="Enter amount"
              className="w-full mt-1 border border-gray-200 rounded-xl px-3 py-2 text-sm text-black font-semibold focus:outline-none focus:border-orange-400"
            />
            {cashGiven && change >= 0 && (
              <p className="text-green-600 text-sm mt-1 font-bold">
                Change: Rs. {change.toFixed(0)}
              </p>
            )}
            {cashGiven && change < 0 && (
              <p className="text-red-500 text-sm mt-1 font-bold">
                Short by Rs. {Math.abs(change).toFixed(0)}
              </p>
            )}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 border border-gray-200 rounded-xl text-black hover:bg-gray-50 font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 py-2 cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}