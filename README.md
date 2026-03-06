# 💸 UPI Expense Tracker-Transactly

> A personal finance dashboard that parses UPI transactions and gives you actionable spending insights — built for the way Indians actually spend money.

🔗 **Live Demo:** _coming soon_
📂 **Built with:** React · Node.js · PostgreSQL · Recharts

---

## ✨ Features

- 📲 **SMS/CSV Import** — Parse UPI SMS messages or upload bank statements
- 📊 **Spending Dashboard** — Monthly overview, category breakdown, daily trend
- 🏷️ **Auto-categorization** — Food, transport, shopping, bills auto-tagged by merchant
- 💰 **Budget Alerts** — Set limits per category, get warned when you're close
- 📈 **Savings Rate Tracker** — See what % of income you're actually saving
- 📤 **Export** — Download transactions as CSV
- 🔁 **Recurring Detection** — Automatically flags subscriptions and EMIs

---

## 🛠️ Tech Stack

| Layer    | Technology                  |
|----------|-----------------------------|
| Frontend | React 18, Recharts, TailwindCSS |
| Backend  | Node.js, Express            |
| Database | PostgreSQL                  |
| Auth     | JWT + bcrypt                |
| Deploy   | Vercel (FE) + Render (BE)   |

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/upi-expense-tracker
cd upi-expense-tracker

# Install dependencies
cd client && npm install
cd ../server && npm install

# Set up environment variables
cp server/.env.example server/.env
# Fill in: DB_URL, JWT_SECRET

# Run locally
cd server && npm run dev     # Backend on :5000
cd client && npm start       # Frontend on :3000
```

---

## 📁 Project Structure

```
upi-expense-tracker/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       └── utils/
├── server/          # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   └── middleware/
└── README.md
```

---

## 🧠 What I Learned

- Built an SMS parser using regex to extract merchant, amount, and date from raw UPI text
- Designed a normalized PostgreSQL schema for multi-user transaction storage  
- Implemented JWT authentication with refresh token rotation
- Used Recharts to build responsive financial visualizations
- Deployed a full-stack app with CI/CD on Vercel + Render

---

## 🔮 Roadmap

- [ ] Google Sheets sync
- [ ] WhatsApp bot to log expenses
- [ ] Monthly spending predictions

---

## 👤 Author

**Disha** — linkedin.com/in/dishaa28

>CSE undergrad · Open to SDE internships & full-stack roles in Bengaluru, Karnataka
