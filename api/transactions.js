const pool = require("./db");

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") return res.status(200).end();

  const path = req.url.replace("/api/transactions", "");

  // GET /api/transactions/summary
  if (req.method === "GET" && path.startsWith("/summary")) {
    try {
      const { user_id } = req.query;
      const spent = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'debit'
         AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
        [user_id]
      );
      const income = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions
         WHERE user_id = $1 AND type = 'credit'
         AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
        [user_id]
      );
      const count = await pool.query(
        `SELECT COUNT(*) as total FROM transactions
         WHERE user_id = $1
         AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)`,
        [user_id]
      );
      const topCategory = await pool.query(
        `SELECT c.name, SUM(t.amount) as total
         FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = 'debit'
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
         GROUP BY c.name ORDER BY total DESC LIMIT 1`,
        [user_id]
      );
      const daily = await pool.query(
        `SELECT TO_CHAR(transaction_date, 'Dy') as day, SUM(amount) as amount
         FROM transactions WHERE user_id = $1 AND type = 'debit'
         AND DATE_TRUNC('month', transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
         GROUP BY transaction_date, TO_CHAR(transaction_date, 'Dy')
         ORDER BY transaction_date`,
        [user_id]
      );
      const categories = await pool.query(
        `SELECT c.name, SUM(t.amount) as value
         FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 AND t.type = 'debit'
         AND DATE_TRUNC('month', t.transaction_date) = DATE_TRUNC('month', CURRENT_DATE)
         GROUP BY c.name`,
        [user_id]
      );
      return res.json({
        spent: parseFloat(spent.rows[0].total),
        income: parseFloat(income.rows[0].total),
        count: parseInt(count.rows[0].total),
        topCategory: topCategory.rows[0] || { name: "None", total: 0 },
        dailyData: daily.rows,
        categoryData: categories.rows,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // GET /api/transactions
  if (req.method === "GET") {
    try {
      const { user_id } = req.query;
      const result = await pool.query(
        `SELECT t.*, c.name as category, c.icon, c.color
         FROM transactions t LEFT JOIN categories c ON t.category_id = c.id
         WHERE t.user_id = $1 ORDER BY t.transaction_date DESC`,
        [user_id]
      );
      return res.json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  // POST /api/transactions
  if (req.method === "POST") {
    try {
      const { user_id, category_id, amount, note, transaction_date, type } = req.body;
      const result = await pool.query(
        `INSERT INTO transactions (user_id, category_id, amount, note, transaction_date, type)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [user_id, category_id, amount, note, transaction_date, type || "debit"]
      );
      return res.json(result.rows[0]);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Server error" });
    }
  }

  return res.status(404).json({ error: "Route not found" });
};