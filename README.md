# Mini Expense Tracker (Studio Graphene Take-Home Assessment)

A highly polished, responsive, and interactive full-stack expense tracking application designed as a take-home assessment for the Full Stack Developer (Node.js + React) Programme. This project is structured as a monorepo featuring a `/client` React SPA (Vite) and `/server` Node.js + Express REST API with persistent JSON database storage.

---

## 📌 Project Overview
This application is a **Mini Expense Tracker** designed to help a single user log their daily spending across multiple categories (Food, Transport, Bills, Entertainment, Other), filter transactions, and monitor their monthly budget limits.

### Core Features:
- **Interactive Dashboard**: Real-time KPI summary cards displaying Total Spent, Transaction Count, Highest Expense, and Daily Average.
- **Custom Donut Chart**: SVG-based animated category distribution chart with interactive segment hover states showing exact values in the center.
- **Budget Tracking**: Custom budget configurations per category. Exceeded budgets dynamically trigger warning banners at the top of the dashboard with individual dismiss controls.
- **Filtering & Search**: Filters logs by categories and date ranges (presets or custom ranges).
- **Import/Export**: Live CSV downloading of currently filtered/visible expenses.
- **Premium Themes**: Sleek toggle switcher between Light Mode (default) and Dark Mode.
- **Persistent Backend**: Connects directly to an Express backend storing data persistently on disk inside JSON files.
- **Mobile Responsive**: Custom navigation drawer and wrapping elements for a seamless experience on tablets and mobile screens.

---

## 📂 Project Structure
```text
mini-expense-tracker/
├── package.json               # Root monorepo workspace scripts
├── README.md                  # Assessment documentation
├── client/                    # React frontend project (Vite)
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx           # Main state manager & frontend coordinator
│   │   ├── index.css          # Design system & dark mode variables
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Left navigation & theme toggle
│   │   │   ├── SummaryCards.jsx # Core statistics indicators
│   │   │   ├── CategoryChart.jsx # SVG distribution donut chart
│   │   │   ├── CategorySummary.jsx # Progress bars and budget modal trigger
│   │   │   ├── BudgetModal.jsx # Set monthly budgets modal overlay
│   │   │   ├── ExpenseTable.jsx # Logs log, filter toolbar, pagination, CSV button
│   │   │   └── ExpenseForm.jsx # Add/Edit transaction modal overlay
│   │   └── utils/
│   │       ├── api.js         # API integration client (using native fetch)
│   │       └── helpers.js     # INR currency, date formatting, CSV download
└── server/                    # Node.js Express backend
    ├── package.json
    ├── server.js              # Express listener & bootstrap
    ├── data/
    │   ├── expenses.json      # JSON Database - Expenses entries
    │   └── budgets.json       # JSON Database - Budgets configuration
    └── src/
        ├── routes/
        │   ├── expenseRoutes.js # Route mappings for expense endpoints
        │   └── budgetRoutes.js  # Route mappings for budget endpoints
        ├── controllers/
        │   ├── expenseController.js # Operations logic & stats calculations
        │   └── budgetController.js  # Operations logic for budgets
        └── middlewares/
            └── validation.js    # Data schema validation middleware
```

---

## ⚙️ Tech Stack & Libraries
- **Frontend**: React 19 (functional hooks), Vite (fast build system), Lucide React (premium UI icons).
- **Backend**: Node.js, Express (REST API endpoints), Cors.
- **Database**: Local JSON files (`expenses.json`, `budgets.json`) read and written atomically via Node’s asynchronous `fs` module, avoiding database configuration overhead while ensuring local persistency.
- **Styling**: Modern Vanilla CSS utilizing HSL custom variables, flexbox/grid layout systems, and cubic-bezier transition animations.

---

## 📡 API Documentation

The Express backend exposes the following REST API endpoints:

| Method | Path | Request Body | Response Shape | Description |
|---|---|---|---|---|
| **GET** | `/api/health` | None | `{ status: "ok", message: "..." }` | Health Check |
| **GET** | `/api/expenses` | None | `Array<Expense>` | Fetch all expenses (supports optional query filters `category`, `startDate`, `endDate`) |
| **GET** | `/api/expenses/stats` | None | `{ totalSpent, spentChange, totalCount, countChange, highestSpent, highestDate, highestDesc, dailyAvg }` | Compute dashboard summary metrics based on date parameters |
| **POST** | `/api/expenses` | `{ description, category, amount, date, note }` | `{ success: true, data: Expense }` | Add new expense (runs schemas validations) |
| **PUT** | `/api/expenses/:id` | `{ description, category, amount, date, note }` | `{ success: true, data: Expense }` | Edit existing expense (runs schemas validations) |
| **DELETE** | `/api/expenses/:id` | None | `{ success: true, message: "..." }` | Delete an expense |
| **GET** | `/api/budgets` | None | `{ Food, Transport, Bills, ... }` | Fetch category monthly budgets |
| **PUT** | `/api/budgets` | `{ Food, Transport, Bills, ... }` | `{ success: true, budgets }` | Save updated budgets |

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have **Node.js** (v18 or higher) installed on your system.

### 1. Clone & Install Dependencies
Run the following commands in your terminal to install packages for the root, frontend, and backend folders:
```bash
# Clone the repository
git clone https://github.com/RitikParihar09/mini-expense-tracker.git
cd mini-expense-tracker

# Install all packages
npm install
npm run install-all
```

### 2. Start the Development Servers
From the root folder, run:
```bash
npm run dev
```
This runs the client development server on `http://localhost:5173/` and the backend server on `http://localhost:5001/` concurrently.

---

## 🔮 Next Steps & Roadmap
1. **Unit Testing**: Add basic endpoint test coverage using Jest/Supertest on the backend, and component verification tests using React Testing Library on the frontend.
2. **Hosted Deployment**: Setup frontend deployment on Vercel/Netlify and backend deployment on Render/Railway.
3. **Enhanced Visualizations**: Add comparative bar charts to display spending trends month-over-month.
