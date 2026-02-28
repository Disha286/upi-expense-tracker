const express = require("express");
const cors = require("cors");
const pool = require("./db");
const expenseRoutes = require("./routes/expenseRoutes");
require("dotenv").config();
require("./config/db");
const app = express();
const PORT = 5000;

//middleware
app.use(cors());
app.use(express.json());

//import transaction routes
const transactionRoutes = require("./routes/transactions");

//use transaction routes
app.use("/transactions", transactionRoutes);

// CREATE EXPENSE
app.post("/expenses", async (req, res) => {
  try {
    const { title, amount, category, method } = req.body;

    const newExpense = await pool.query(
      "INSERT INTO expenses (title, amount, category, method) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, amount, category, method]
    );

    res.json(newExpense.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// test root route
app.get("/", (req, res) => {
  res.send("Backend Connected Successfully 🚀");
});

// ✅ connect expense routes
app.use("/api/expenses", expenseRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.listen(5000, () => {
  console.log("PostgreSQL Connected Successfully");
  console.log("Server running on port 5000");
});