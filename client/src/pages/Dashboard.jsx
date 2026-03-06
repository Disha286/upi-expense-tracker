import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

const COLORS = ["#4caf7d", "#60a8f0", "#f09040", "#f0d060", "#b57bff"];

const ICONS = {
  Food: "🍔", Transport: "🚗", Shopping: "🛒",
  Entertainment: "🎬", Bills: "📱", Income: "💰"
};

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","id":2}');

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [txnRes, summaryRes] = await Promise.all([
        API.get(`/transactions?user_id=${user.id}`),
        API.get(`/transactions/summary?user_id=${user.id}`)
      ]);
      setTransactions(txnRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      setError("Failed to load data. Is your server running?");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const saved = summary ? summary.income - summary.spent : 0;
  const savingsRate = summary?.income > 0
    ? Math.round((saved / summary.income) * 100)
    : 0;

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-gray-400 text-sm">Loading your dashboard...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-red-400 text-sm">{error}</div>
    </div>
  );

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
          <p className="text-gray-400 text-sm mt-1">
            {new Date().toLocaleString("default", { month: "long", year: "numeric" })} · Your spending overview
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Spent</p>
            <p className="text-2xl font-bold text-red-400">
              ₹{summary?.spent?.toLocaleString() || 0}
            </p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Saved</p>
            <p className="text-2xl font-bold text-green-400">
              ₹{saved.toLocaleString()}
            </p>
            <p className="text-gray-500 text-xs mt-1">{savingsRate}% savings rate</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Transactions</p>
            <p className="text-2xl font-bold text-blue-400">{summary?.count || 0}</p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Top Category</p>
            <p className="text-2xl font-bold text-yellow-400">
              {summary?.topCategory?.name || "None"}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              ₹{parseFloat(summary?.topCategory?.total || 0).toLocaleString()} spent
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Daily Spending
            </h3>
            {summary?.dailyData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={summary.dailyData}>
                  <XAxis dataKey="day" tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                    formatter={(val) => [`₹${val}`, "Spent"]}
                  />
                  <Bar dataKey="amount" fill="#4caf7d" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                No spending data yet
              </div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
              Category Breakdown
            </h3>
            {summary?.categoryData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={summary.categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {summary.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-600 text-sm">
                No category data yet
              </div>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Recent Transactions
          </h3>
          {transactions.length > 0 ? (
            <div className="space-y-3">
              {transactions.slice(0, 10).map((txn) => (
                <div key={txn.id} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-sm">
                      {ICONS[txn.category] || "💳"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{txn.note || "Transaction"}</p>
                      <p className="text-xs text-gray-500">{txn.category} · {txn.transaction_date?.slice(0, 10)}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${txn.type === "credit" ? "text-green-400" : "text-red-400"}`}>
                    {txn.type === "credit" ? "+" : "-"}₹{parseFloat(txn.amount).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-sm">No transactions yet</p>
              <p className="text-gray-700 text-xs mt-1">Add your first transaction to see it here</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}