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

const CATEGORIES = [
  { id: 12, name: "Food", icon: "🍔" },
  { id: 13, name: "Transport", icon: "🚗" },
  { id: 14, name: "Shopping", icon: "🛒" },
  { id: 15, name: "Bills", icon: "📱" },
  { id: 16, name: "Entertainment", icon: "🎬" },
];

const INCOME_CATEGORIES = [
  { id: 12, name: "Salary", icon: "💼" },
  { id: 13, name: "Freelance", icon: "💻" },
  { id: 14, name: "Investment", icon: "📈" },
  { id: 15, name: "Gift", icon: "🎁" },
  { id: 16, name: "Other Income", icon: "💰" },
];

function AddTransactionModal({ onClose, onSuccess, userId }) {
  const [form, setForm] = useState({
    amount: "",
    note: "",
    category_id: "12",
    type: "debit",
    transaction_date: new Date().toISOString().slice(0, 10),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await API.post("/transactions", {
        ...form,
        user_id: userId,
        amount: parseFloat(form.amount),
        category_id: parseInt(form.category_id),
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to add transaction. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-md p-6">

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Add Transaction</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white text-xl transition-colors"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Type toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "debit" })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-600 font-semibold transition-colors ${
                form.type === "debit"
                  ? "bg-red-500/20 border border-red-500/50 text-red-400"
                  : "bg-gray-800 border border-gray-700 text-gray-400"
              }`}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, type: "credit" })}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                form.type === "credit"
                  ? "bg-green-500/20 border border-green-500/50 text-green-400"
                  : "bg-gray-800 border border-gray-700 text-gray-400"
              }`}
            >
              💰 Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1.5">
              Amount (₹)
            </label>
            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="1"
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder-gray-600"
            />
          </div>

          {/* Note */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1.5">
              Note
            </label>
            <input
              type="text"
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder={form.type === "credit" ? "e.g. Freelance payment" : "e.g. Swiggy order"}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors placeholder-gray-600"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1.5">
              Category
            </label>
            <select
  name="category_id"
  value={form.category_id}
  onChange={handleChange}
  className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
>
  {(form.type === "credit" ? INCOME_CATEGORIES : CATEGORIES).map((cat) => (
    <option key={cat.id} value={cat.id}>
      {cat.icon} {cat.name}
    </option>
  ))}
</select>
          </div>

          {/* Date */}
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-1.5">
              Date
            </label>
            <input
              type="date"
              name="transaction_date"
              value={form.transaction_date}
              onChange={handleChange}
              required
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-green-500 transition-colors"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-400 disabled:bg-green-500/50 text-gray-950 font-bold rounded-lg py-3 text-sm transition-colors mt-2"
          >
            {loading ? "Adding..." : "Add Transaction"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || '{"name":"User","id":4}');

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

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

      {/* Modal */}
      {showModal && (
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={fetchData}
          userId={user.id}
        />
      )}

      {/* Navbar */}
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">💸</span>
          <span className="font-bold text-white">Transactly</span>
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              {new Date().toLocaleString("default", { month: "long", year: "numeric" })} · Your spending overview
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-green-500 hover:bg-green-400 text-gray-950 font-bold px-5 py-2.5 rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            + Add Transaction
          </button>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Spent</p>
            <p className="text-2xl font-bold text-red-400">₹{summary?.spent?.toLocaleString() || 0}</p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Saved</p>
            <p className="text-2xl font-bold text-green-400">₹{saved.toLocaleString()}</p>
            <p className="text-gray-500 text-xs mt-1">{savingsRate}% savings rate</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Transactions</p>
            <p className="text-2xl font-bold text-blue-400">{summary?.count || 0}</p>
            <p className="text-gray-500 text-xs mt-1">This month</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Top Category</p>
            <p className="text-2xl font-bold text-yellow-400">{summary?.topCategory?.name || "None"}</p>
            <p className="text-gray-500 text-xs mt-1">₹{parseFloat(summary?.topCategory?.total || 0).toLocaleString()} spent</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Daily Spending</h3>
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
              <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No spending data yet</div>
            )}
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Category Breakdown</h3>
            {summary?.categoryData?.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={summary.categoryData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                    {summary.categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
                    formatter={(val) => [`₹${val}`, ""]}
                  />
                  <Legend iconType="circle" iconSize={8} formatter={(val) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{val}</span>} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-48 flex items-center justify-center text-gray-600 text-sm">No category data yet</div>
            )}
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Recent Transactions</h3>
            <span className="text-xs text-gray-600">{transactions.length} total</span>
          </div>
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
              <button
                onClick={() => setShowModal(true)}
                className="text-green-400 text-xs mt-2 hover:text-green-300"
              >
                + Add your first transaction
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}