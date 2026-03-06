import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#4caf7d", "#60a8f0", "#f09040", "#f0d060", "#b57bff"];

const mockTransactions = [
  { id: 1, note: "Swiggy order", amount: 340, category: "Food", transaction_date: "2025-07-24", type: "debit" },
  { id: 2, note: "Rapido ride", amount: 85, category: "Transport", transaction_date: "2025-07-23", type: "debit" },
  { id: 3, note: "Zepto groceries", amount: 650, category: "Shopping", transaction_date: "2025-07-22", type: "debit" },
  { id: 4, note: "Netflix", amount: 199, category: "Entertainment", transaction_date: "2025-07-21", type: "debit" },
  { id: 5, note: "Salary", amount: 25000, category: "Income", transaction_date: "2025-07-01", type: "credit" },
  { id: 6, note: "Zomato", amount: 420, category: "Food", transaction_date: "2025-07-20", type: "debit" },
  { id: 7, note: "BESCOM bill", amount: 800, category: "Bills", transaction_date: "2025-07-19", type: "debit" },
];

const mockBarData = [
  { day: "Mon", amount: 420 },
  { day: "Tue", amount: 850 },
  { day: "Wed", amount: 270 },
  { day: "Thu", amount: 1100 },
  { day: "Fri", amount: 600 },
  { day: "Sat", amount: 1400 },
  { day: "Sun", amount: 340 },
];

const mockPieData = [
  { name: "Food", value: 760 },
  { name: "Transport", value: 85 },
  { name: "Shopping", value: 650 },
  { name: "Bills", value: 800 },
  { name: "Entertainment", value: 199 },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User"}');
  const totalSpent = mockPieData.reduce((a, b) => a + b.value, 0);
  const saved = 25000 - totalSpent;
  const savingsRate = Math.round((saved / 25000) * 100);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💸</span>
          <span className="font-bold text-white">UPI Tracker</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm">Hey, {user.name} 👋</span>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">July 2025 · Your spending overview</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Spent</p>
            <p className="text-2xl font-bold text-red-400">₹{totalSpent.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Saved</p>
            <p className="text-2xl font-bold text-green-400">₹{saved.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">{savingsRate}% savings rate</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Transactions</p>
            <p className="text-2xl font-bold text-blue-400">{mockTransactions.length}</p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Top Category</p>
            <p className="text-2xl font-bold text-yellow-400">Bills</p>
            <p className="text-gray-500 text-xs mt-1">₹800 spent</p>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* Bar Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Daily Spending
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={mockBarData}>
                <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  labelStyle={{ color: "#fff" }}
                  formatter={(val) => [`₹${val}`, "Spent"]}
                />
                <Bar dataKey="amount" fill="#4caf7d" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Category Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={mockPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {mockPieData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                  formatter={(val) => [`₹${val}`, ""]}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Recent Transactions
          </h3>
          <div className="space-y-3">
            {mockTransactions.map((txn) => (
              <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-sm">
                    {txn.category === "Food" ? "🍔" :
                     txn.category === "Transport" ? "🚗" :
                     txn.category === "Shopping" ? "🛒" :
                     txn.category === "Entertainment" ? "🎬" :
                     txn.category === "Income" ? "💰" : "📱"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{txn.note}</p>
                    <p className="text-xs text-gray-500">{txn.category} · {txn.transaction_date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${txn.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                  {txn.type === "credit" ? "+" : "-"}₹{txn.amount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}