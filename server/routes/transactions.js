const express = require("express");
const router = express.Router();
const pool = require("../db");

// POST /transactions
router.post("/", async (req, res) => {
  try {
    const { user_id, category_id, amount, note, transaction_date } = req.body;

    const result = await pool.query(
      `INSERT INTO transactions (user_id, category_id, amount, note, transaction_date)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [user_id, category_id, amount, note, transaction_date]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;