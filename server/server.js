console.log("📂 Current directory:", __dirname);
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const transactionRoutes = require("./routes/transactions");
const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

app.use("/transactions", transactionRoutes);
app.use("/api/expenses", expenseRoutes);

// Test root route
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully ✅");
});

// ONE listen only
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});