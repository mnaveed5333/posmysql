"use client";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const LINE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#a855f7", "#ef4444"];

export default function ReportsPage() {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [productChartData, setProductChartData] = useState([]);

  useEffect(() => {
    fetch("/api/reports")
      .then((r) => r.json())
      .then(setSalesData);

    fetch("/api/reports/top-products")
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res)) return; // empty case from API
        setTopProducts(res.topProducts || []);
        setProductChartData(res.chartData || []);
      });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Sales Report</h1>

      {/* 30-Day Sales Chart */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">
          Last 30 Days Sales
        </h2>
        {salesData.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-10">
            No data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value) => [`Rs. ${value}`, "Sales"]} />
              <Bar dataKey="total" fill="#f97316" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Products by Day Chart */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-sm font-semibold text-gray-500 mb-4">
          Top 5 Best-Selling Products (Last 30 Days)
        </h2>
        {productChartData.length === 0 ? (
          <p className="text-gray-300 text-sm text-center py-10">
            No data available
          </p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={productChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {topProducts.map((name, i) => (
                <Line
                  key={name}
                  type="monotone"
                  dataKey={name}
                  stroke={LINE_COLORS[i % LINE_COLORS.length]}
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}