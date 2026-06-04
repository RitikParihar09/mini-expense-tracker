# Mini Expense Tracker (Studio Graphene Take-Home Assessment)

A highly polished, responsive, and interactive expense tracking application designed as a take-home assessment for the Full Stack Developer (Node.js + React) Programme. This project is structured as a monorepo featuring a `/client` React SPA (Vite) and `/server` Express REST API.

---

## 📌 Project Overview
This application is a **Mini Expense Tracker** designed to help a single user log their daily spending across multiple categories (Food, Transport, Bills, Entertainment, Other), filter transactions, and monitor their monthly budget limits.

### Core Frontend Highlights:
- **Responsive KPI Cards**: Visualizing Total Spent, Transaction Count, Highest Expense, and Daily Average.
- **Custom Donut Chart**: SVG-based animated category distribution chart.
- **Budget Tracking Switch**: Exceeded budgets dynamically trigger warn indicators at the top of the dashboard.
- **Filtering & Search**: Filter by categories and date ranges (presets or custom ranges).
- **Import/Export**: Live CSV downloading of currently filtered/visible expenses.
- **Premium Themes**: Sleek toggle switcher between Light Mode (default) and Dark Mode.

---

## ⚙️ Tech Stack & Libraries
- **Frontend**: React 19 (functional hooks), Vite (fast build system), Lucide React (premium UI icons).
- **Backend**: Node.js, Express (REST API endpoints), Cors.
- **Styling**: Modern Vanilla CSS utilizing CSS variables, flexbox/grid layout systems, and smooth transitions.
- **Database (Planned)**: JSON file-based local database for persistent storage (to be wired tomorrow).

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
│   │   ├── App.jsx           # Main state manager & page router
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
│   │       └── helpers.js     # INR currency, date formatting, CSV download
└── server/                    # Node.js backend API skeleton
    ├── package.json
    └── server.js              # Express listener & endpoints config
```

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
This runs the client development server on `http://localhost:5174/` (or `http://localhost:5173/`) and the backend server on `http://localhost:5001/` concurrently.

---

## 📡 API Documentation (Planned Endpoints)

The Express backend exposes the following REST API endpoints:

| Method | Path | Request Body | Response Shape | Description |
|---|---|---|---|---|
| **GET** | `/api/health` | None | `{ status: "ok", message: "..." }` | Health Check |
| **GET** | `/api/expenses` | None | `Array<Expense>` | Fetch all expenses |
| **POST** | `/api/expenses` | `{ description, category, amount, date, note }` | `{ success: true, data: Expense }` | Add new expense |
| **PUT** | `/api/expenses/:id` | `{ description, category, amount, date, note }` | `{ success: true, data: Expense }` | Edit existing expense |
| **DELETE** | `/api/expenses/:id` | None | `{ success: true, id }` | Delete an expense |
| **GET** | `/api/budgets` | None | `{ Food, Transport, Bills, ... }` | Fetch monthly budgets |
| **PUT** | `/api/budgets` | `{ Food, Transport, Bills, ... }` | `{ success: true, data: Budgets }` | Save updated budgets |

---

## 🔮 Next Steps & Roadmap
1. **Express Server Wiring**: Implement backend routes to read/write transactional and budget settings to a persistent local JSON database file.
2. **REST Integration**: Swap the client-side `localStorage` CRUD handlers with `fetch` API requests to talk directly to the Express server.
3. **Unit Testing**: Add basic endpoint test coverage using Jest/Supertest on the backend, and component verification tests using React Testing Library on the frontend.
4. **Enhanced Visualizations**: Add bar charts to compare spending trends month-over-month.
