const express = require("express");
const router = express.Router();

// temporary test route
router.post("/add", (req, res) => {
  res.json({
    message: "Expense route working!",
    data: req.body,
  });
});

module.exports = router;