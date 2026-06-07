# Mini Expense Tracker

A highly polished, responsive, and interactive full-stack expense tracking web application built using React, Node.js, and Express.
This project was developed as part of the **Studio Graphene Full Stack Developer Assessment (Exercise 2: Mini Expense Tracker)**.

The application allows users to:
* Add, edit, and delete expenses
* Track spending by category
* View expense summaries and analytics
* Set category-wise monthly budgets
* Export expenses as CSV
* Visualize spending trends using interactive charts

---

# 🔗 Live Demo

## Frontend (Vercel)
https://mini-expense-tracker-olive.vercel.app/

## Backend API (Render)
https://mini-expense-tracker-api-viwu.onrender.com

---

# 🚀 Features

## Expense Management
* **Add Expenses**: Log purchases with amount, category, date, and optional note.
* **Edit Expenses**: Update transaction properties inline.
* **Delete Expenses**: Safely remove records with a custom delete confirmation dialog.
* **Clean List View**: View transactions in a clean table layout, which auto-collapses into responsive cards on mobile screens.

## Filtering & Sorting
* **Category Filters**: Filter transactions by Food, Transport, Bills, Entertainment, or Other.
* **Date Range Filters**: Select specific calendar boundaries with presets like "This Month", "Last Month", or "All Time".
* **Sort Controls**: Sort expenditures by date or amount in ascending/descending order (defaulting to newest first).

## Dashboard Analytics & Charts
* **KPI Summary Cards**: Dynamic cards showing total spending, transaction counts, highest expense, and daily average.
* **Monthly Comparatives**: Visual growth percentages comparing current period statistics to the previous month.
* **Category Donut Chart**: High-performance interactive SVG donut chart displaying slice distribution. Supports click-to-toggle details on mobile viewports.
* **Daily Spending Trend**: Vertical bar chart mapping spending over the last 7 calendar days. Supports touch toggling for bar detail popovers.

## Budget Management
* **Monthly Budgets**: Set custom monthly caps for each category.
* **Visual Alerts**: Highlights category progress indicators in red and triggers budget banners when category spending exceeds the defined limit.

## Additional Luxuries
* **CSV Export**: Instantly export current filtered transaction tables to a CSV file.
* **Responsive Layout**: Tailored support for mobile viewports down to 320px width without clipping or horizontal scrolls.
* **Dark / Light Mode**: Beautiful glassmorphic themes powered by native CSS variable switches.
* **Toast Notifications**: Smooth notification banners confirming successful actions or reporting backend errors.
* **Auto-Persistent Storage**: Local JSON storage ensures that transactions are saved across server restarts.

---

# 🛠️ Tech Stack

## Frontend
* **React 19 (Vite)**: Component-driven single page application structure.
* **Lucide React Icons**: Crisp, SVG-based icons.
* **Vanilla CSS**: Premium modern CSS variables, transitions, and glassmorphism styling. No heavy framework dependency.

## Backend
* **Node.js & Express.js**: RESTful endpoint routes and server middleware handling.
* **Local JSON File Database**: Persists data to disk locally (`expenses.json` and `budgets.json`) under the server module, keeping local execution fast and zero-config.

## Testing
* **Jest & Supertest**: Automated backend route testing suite with mocked filesystem databases for isolated testing.

---

# 📂 Project Structure

```bash
mini-expense-tracker/
├── package.json               # Root monorepo scripts for easy local start
├── README.md                  # Main documentation
├── client/                    # Frontend React SPA
│   ├── src/
│   │   ├── assets/            # Static assets
│   │   ├── components/        # Layout and display widgets
│   │   │   ├── Sidebar.jsx
│   │   │   ├── SummaryCards.jsx
│   │   │   ├── CategoryChart.jsx
│   │   │   ├── CategorySummary.jsx
│   │   │   ├── ExpenseTable.jsx
│   │   │   ├── ExpenseForm.jsx
│   │   │   └── BudgetModal.jsx
│   │   ├── utils/
│   │   │   ├── api.js         # Integration endpoint clients
│   │   │   └── helpers.js     # Helper utilities
│   │   ├── App.jsx            # Main app container
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── server/                    # Node.js API server
    ├── server.js              # Server entry point
    ├── data/                  # Storage folder
    │   ├── expenses.json
    │   └── budgets.json
    ├── src/
    │   ├── controllers/       # Controller handlers
    │   ├── middlewares/       # Validation rules
    │   ├── routes/            # REST routers
    │   └── tests/             # Automated test cases
    └── package.json
```

---

# ⚙️ How to Run Locally

## 1. Clone the Repository
```bash
git clone https://github.com/RitikParihar09/mini-expense-tracker.git
cd mini-expense-tracker
```

## 2. Install Dependencies
Install dependencies for the monorepo root, frontend client, and backend server:
```bash
npm install
npm run install-all
```

## 3. Run the Development Server
Launch both the frontend client and the backend server concurrently:
```bash
npm run dev
# OR for exposing client server on local network:
npm run dev:host
```
* **Frontend SPA** runs on: [http://localhost:5173/](http://localhost:5173/)
* **Backend Server API** runs on: `http://localhost:5001/`

## 4. Run Backend Tests
Run the automated route validation test suite:
```bash
cd server
npm test
```

---

# 📡 API Documentation

## Health Status
### GET `/api/health`
Checks server status.
* **Response:**
  ```json
  {
    "status": "ok",
    "message": "Expense Tracker API is running"
  }
  ```

---

## Expenses APIs

### GET All Expenses
### GET `/api/expenses`
Returns all logged expenses. Filters can be applied via query strings.
* **Query Parameters (Optional):**
  * `category` (e.g. `Food`)
  * `startDate` (`YYYY-MM-DD`)
  * `endDate` (`YYYY-MM-DD`)

### Add Expense
### POST `/api/expenses`
Creates a new expense log.
* **Request Body:**
  ```json
  {
    "amount": 250,
    "category": "Food",
    "date": "2026-06-07",
    "description": "Lunch",
    "note": "With friends"
  }
  ```

### Update Expense
### PUT `/api/expenses/:id`
Updates an existing expense entry.

### Delete Expense
### DELETE `/api/expenses/:id`
Deletes an expense.

---

## Budget APIs

### GET Budgets
### GET `/api/budgets`
Retrieves the target monthly budget thresholds per category.

### Update Budgets
### PUT `/api/budgets`
Updates the monthly budget thresholds.
* **Request Body:**
  ```json
  {
    "Food": 5000,
    "Transport": 3000,
    "Bills": 3000,
    "Entertainment": 2000,
    "Other": 1500
  }
  ```

---

# 🛡️ Validation Rules

* **Amount**: Must be a positive number greater than `0`.
* **Category**: Must be one of the pre-defined options (`Food`, `Transport`, `Bills`, `Entertainment`, `Other`).
* **Date**: Future dates are blocked.
* **Description**: Required field, cannot be left empty.

---

# 🔮 Future Improvements

Given more time, the following features would be added:
* **Authentication**: Multi-user account support with JWT sessions.
* **Database Support**: Transitioning database persistence to MongoDB or PostgreSQL.
* **Search Field**: Real-time keyword filtering across description and notes fields.
* **Recurring Logs**: Auto-logging subscription plans (e.g., Netflix, Gym membership).
* **Advanced Analytics**: Interactive monthly trend comparison charts over multiple years.

---

# 💡 Notes
* Persistent storage uses local JSON files instead of an external database to keep review installation zero-config.
* Chart visual triggers are fully responsive and optimized for screen rotation, desktop scaling, and mobile simulators.

---

# 👤 Author

**Ritik Parihar**
* **GitHub**: [https://github.com/RitikParihar09](https://github.com/RitikParihar09)
