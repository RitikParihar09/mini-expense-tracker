# Mini Expense Tracker (Exercise 2)

A highly polished, responsive, and interactive full-stack expense tracking application designed as a take-home assessment for the Full Stack Developer Programme. We chose **Exercise 2: Mini Expense Tracker** to build a single-user application that allows tracking, editing, deleting, and filtering daily expenditures with custom budget allocations per category, dynamic KPI cards, interactive SVG charts, currency formatting, and automated endpoint tests. The project is structured as a monorepo featuring a React single-page application (client) and a lightweight Node.js/Express REST API (server) that persists transaction data locally to disk.

---

## 🔗 Live Demo Links
*   **Local Host**: [http://localhost:5173](http://localhost:5173) (Local client server)
*   **Production Deployment**: *Not Deployed* (Configured for local execution and manual review)

---

## 🛠️ Tech Stack & Why We Used Them

*   **Frontend: React 19 (Vite) & Lucide React**
    *   *Why*: React allows us to build a highly reactive UI with instant status updates. Vite was selected as the build tool for its extremely fast Hot Module Replacement (HMR) during development. Lucide React provides crisp, lightweight, and modern iconography.
*   **Backend: Node.js & Express**
    *   *Why*: Express provides a minimalist, robust routing system for handling RESTful API requests and executing custom validation middlewares.
*   **Database: Local JSON Files (`expenses.json` & `budgets.json`)**
    *   *Why*: Persisting data to JSON files avoids the overhead of setting up a full external database like PostgreSQL or MongoDB, making the app simple to run for reviewers while fully satisfying the requirement of persistence across server restarts.
*   **Testing: Jest & Supertest**
    *   *Why*: Jest is a powerful testing framework. Supertest allows us to simulate GET, POST, PUT, and DELETE requests to our Express app. We mocked the database file-system layers inside our test files to run tests in-memory, ensuring they run instantly without corrupting actual developer data files.
*   **Styling: Vanilla CSS & HSL Custom Properties**
    *   *Why*: We built a custom modern design system using native CSS variables (HSL color spaces) for flexibility, enabling smooth theme transitions between Light Mode and Dark Mode without introducing massive utility libraries.

---

## ⚙️ How to Run Locally

Follow these instructions to run the application. We assume you only have **Node.js** (v18 or higher) installed.

### 1. Clone & Install Dependencies
Run the following commands in your terminal to clone the repo and install packages:
```bash
# Clone the repository
git clone https://github.com/RitikParihar09/mini-expense-tracker.git
cd mini-expense-tracker

# Install root, client, and server dependencies
npm install
npm run install-all
```

### 2. Start the Development Servers
Launch both the frontend client and backend server concurrently:
```bash
npm run dev
```
*   The **Frontend Web UI** will open on: [http://localhost:5173/](http://localhost:5173/)
*   The **Backend Server API** will run on: `http://localhost:5001/`

### 3. Run Backend Test Suite
To execute the automated unit and integration tests:
```bash
cd server
npm test
```

---

## 📡 API Documentation

The Express backend exposes the following endpoints:

### 1. Health Status
*   **Method**: `GET`
*   **Path**: `/api/health`
*   **Response Shape**:
    ```json
    {
      "status": "ok",
      "message": "Server is healthy and running"
    }
    ```

### 2. Get Expenses
*   **Method**: `GET`
*   **Path**: `/api/expenses`
*   **Query Parameters**:
    *   `category` (optional, e.g. `Food`)
    *   `startDate` (optional, format `YYYY-MM-DD`)
    *   `endDate` (optional, format `YYYY-MM-DD`)
*   **Response Shape**:
    ```json
    [
      {
        "id": 1780672671885,
        "date": "2026-06-05",
        "description": "Taxi ride to office",
        "category": "Transport",
        "amount": 250,
        "note": "Met with client"
      }
    ]
    ```

### 3. Create Expense
*   **Method**: `POST`
*   **Path**: `/api/expenses`
*   **Request Body**:
    ```json
    {
      "date": "2026-06-05",
      "description": "Lunch with friends",
      "category": "Food",
      "amount": 450.00,
      "note": "Pizza"
    }
    ```
*   **Response Shape**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1780672671999,
        "date": "2026-06-05",
        "description": "Lunch with friends",
        "category": "Food",
        "amount": 450.00,
        "note": "Pizza"
      }
    }
    ```

### 4. Edit Expense
*   **Method**: `PUT`
*   **Path**: `/api/expenses/:id`
*   **Request Body**: Same schema as **Create Expense**
*   **Response Shape**:
    ```json
    {
      "success": true,
      "data": {
        "id": 1780672671999,
        "date": "2026-06-05",
        "description": "Lunch with colleagues",
        "category": "Food",
        "amount": 500.00,
        "note": "Company lunch reimbursement"
      }
    }
    ```

### 5. Delete Expense
*   **Method**: `DELETE`
*   **Path**: `/api/expenses/:id`
*   **Response Shape**:
    ```json
    {
      "success": true,
      "message": "Expense deleted successfully"
    }
    ```

### 6. Get Budgets
*   **Method**: `GET`
*   **Path**: `/api/budgets`
*   **Response Shape**:
    ```json
    {
      "Food": 5000,
      "Transport": 3000,
      "Bills": 3000,
      "Entertainment": 2000,
      "Other": 1500
    }
    ```

### 7. Save Budgets
*   **Method**: `PUT`
*   **Path**: `/api/budgets`
*   **Request Body**:
    ```json
    {
      "Food": 6000,
      "Transport": 3500,
      "Bills": 4000,
      "Entertainment": 2500,
      "Other": 2000
    }
    ```
*   **Response Shape**:
    ```json
    {
      "success": true,
      "budgets": {
        "Food": 6000,
        "Transport": 3500,
        "Bills": 4000,
        "Entertainment": 2500,
        "Other": 2000
      }
    }
    ```

### 8. Compute Statistics
*   **Method**: `GET`
*   **Path**: `/api/expenses/stats`
*   **Query Parameters**: `startDate` and `endDate`
*   **Response Shape**:
    ```json
    {
      "totalSpent": 12540.50,
      "spentChange": 18.2,
      "isNewSpent": false,
      "totalCount": 28,
      "countChange": 5,
      "isNewCount": false,
      "highestSpent": 3200.00,
      "highestDate": "2026-06-02",
      "highestDesc": "Electricity Bill",
      "dailyAvg": 418.02
    }
    ```

---

## 📂 Project Structure

```text
mini-expense-tracker/
├── package.json               # Root monorepo configuration scripts
├── README.md                  # Assessment documentation
├── client/                    # React frontend project (Vite)
│   ├── package.json
│   ├── index.html
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx           # Main state manager & dashboard router
│   │   ├── index.css          # Design system & dark mode variables
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Left navigation panel & theme switcher
│   │   │   ├── SummaryCards.jsx # Top dashboard indicators (KPIs)
│   │   │   ├── CategoryChart.jsx # SVG animated donut chart
│   │   │   ├── CategorySummary.jsx # Budgets progress bars
│   │   │   ├── BudgetModal.jsx # Adjust category budgets overlay
│   │   │   ├── ExpenseTable.jsx # Transaction logs with pagination & filters
│   │   │   └── ExpenseForm.jsx # Add/Edit transaction modal overlay
│   │   └── utils/
│   │       ├── api.js         # Integration layer client (Native Fetch)
│   │       └── helpers.js     # Helpers for currency, CSV exporting
└── server/                    # Node.js Express backend
    ├── package.json
    ├── server.js              # Server entry point
    ├── data/
    │   ├── expenses.json      # Persistent storage database for expenses
    │   └── budgets.json       # Persistent storage database for budgets
    └── src/
        ├── routes/
        │   ├── expenseRoutes.js # Routes mapping for expenses
        │   └── budgetRoutes.js  # Routes mapping for budgets
        ├── controllers/
        │   ├── expenseController.js # Aggregations, CRUD controllers
        │   └── budgetController.js  # Budget management controllers
        ├── middlewares/
        │   └── validation.js    # Data schema validation middleware
        └── tests/
            └── server.test.js   # Automated API endpoint tests using Jest
```

---

## 🔮 Next Steps & Decisions

### What We Chose Not to Do
1.  **User Authentication (Sign In/Sign Up)**: We did not implement auth because the brief specified a single-user dashboard where no authentication is needed.
2.  **External Database Server**: We bypassed databases like MongoDB or PostgreSQL and chose persistent JSON files to make local setups extremely straightforward for reviewers.
3.  **Frontend Component Tests**: We prioritized writing a comprehensive integration test suite for backend controllers and APIs, choosing not to write React component unit tests (e.g. testing specific React button clicks) to focus on the API contracts first.

### What We Would Build Next
1.  **Multiple Users & Auth**: Add JWT-based cookie session authentication allowing different users to maintain separate budgets and expenses.
2.  **Interactive Budget Alerts Config**: Allow users to toggle whether they want notifications via email or desktop alerts when a category budget exceeds 80% or 100%.
3.  **Recurring Expenses**: Allow users to set repeating transactions (e.g., monthly Netflix or house rent) that are logged automatically on the scheduled day.
