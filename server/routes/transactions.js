const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ TEST ROUTE (keep this)
router.get("/test", (req, res) => {
  res.send("Transactions route works!");
});


// ✅ CREATE TRANSACTION
router.post("/", async (req, res) => {
  try {
    const { user_id, category_id, amount, note, transaction_date, type } = req.body;

    const newTransaction = await pool.query(
      `INSERT INTO transactions 
       (user_id, category_id, amount, note, transaction_date, type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [user_id, category_id, amount, note, transaction_date, type || 'debit']
    );

    res.json(newTransaction.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET all transactions for a user
router.get("/", async (req, res) => {
  try {
    const { user_id } = req.query;
    const result = await pool.query(
      `SELECT t.*, c.name as category, c.icon, c.color 
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1
       ORDER BY t.transaction_date DESC`,
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// GET summary stats for a user
router.get("/summary", async (req, res) => {
  try {
    const { user_id } = req.query;

    // Total spent this month
    const spent = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'debit'
       AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
      [user_id]
    );

    // Total credited this month
    const income = await pool.query(
      `SELECT COALESCE(SUM(amount), 0) as total
       FROM transactions
       WHERE user_id = $1 AND type = 'credit'
       AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
      [user_id]
    );

    // Count this month
    const count = await pool.query(
      `SELECT COUNT(*) as total
       FROM transactions
       WHERE user_id = $1
       AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
      [user_id]
    );

    // Top category
    const topCategory = await pool.query(
      `SELECT c.name, SUM(t.amount) as total
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = 'debit'
       AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY c.name
       ORDER BY total DESC
       LIMIT 1`,
      [user_id]
    );

    // Daily spending for bar chart
    const daily = await pool.query(
      `SELECT TO_CHAR(transaction_date, 'Dy') as day,
              SUM(amount) as amount
       FROM transactions
       WHERE user_id = $1 AND type = 'debit'
       AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY transaction_date, TO_CHAR(transaction_date, 'Dy')
       ORDER BY transaction_date`,
      [user_id]
    );

    // Category breakdown for pie chart
    const categories = await pool.query(
      `SELECT c.name, SUM(t.amount) as value
       FROM transactions t
       LEFT JOIN categories c ON t.category_id = c.id
       WHERE t.user_id = $1 AND t.type = 'debit'
       AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
       GROUP BY c.name`,
      [user_id]
    );

    res.json({
      spent: parseFloat(spent.rows[0].total),
      income: parseFloat(income.rows[0].total),
      count: parseInt(count.rows[0].total),
      topCategory: topCategory.rows[0] || { name: "None", total: 0 },
      dailyData: daily.rows,
      categoryData: categories.rows,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;