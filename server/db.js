const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  password: "postgres123",
  host: "localhost",
  port: 5432,
  database: "upi_expense_tracker",
});

pool.connect()
  .then(() => console.log("PostgreSQL Connected Successfully"))
  .catch(err => console.error("PostgreSQL Connection Error:", err));

module.exports = pool;