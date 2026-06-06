const request = require('supertest');

// Mock dbHelper to prevent writing to real JSON files during tests
jest.mock('../utils/dbHelper', () => {
  return {
    readExpenses: jest.fn(),
    writeExpenses: jest.fn(),
    readBudgets: jest.fn(),
    writeBudgets: jest.fn()
  };
});

const dbHelper = require('../utils/dbHelper');
const app = require('../../server');

describe('Express REST API Endpoints', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/health', () => {
    it('should return 200 OK and health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('Budgets API', () => {
    const mockBudgets = {
      Food: 5000,
      Transport: 3000,
      Bills: 3000,
      Entertainment: 2000,
      Other: 1500
    };

    describe('GET /api/budgets', () => {
      it('should return 200 OK and budgets object', async () => {
        dbHelper.readBudgets.mockResolvedValue(mockBudgets);

        const response = await request(app)
          .get('/api/budgets')
          .expect(200);

        expect(response.body).toEqual(mockBudgets);
        expect(dbHelper.readBudgets).toHaveBeenCalledTimes(1);
      });
    });

    describe('PUT /api/budgets', () => {
      it('should successfully update budgets and return 200', async () => {
        const newBudgets = {
          Food: 6000,
          Transport: 3500,
          Bills: 4000,
          Entertainment: 2500,
          Other: 2000
        };
        dbHelper.writeBudgets.mockResolvedValue();

        const response = await request(app)
          .put('/api/budgets')
          .send(newBudgets)
          .expect(200);

        expect(response.body).toEqual({ success: true, budgets: newBudgets });
        expect(dbHelper.writeBudgets).toHaveBeenCalledWith(newBudgets);
      });

      it('should return 400 if validation fails (negative budget)', async () => {
        const invalidBudgets = {
          Food: -100
        };

        const response = await request(app)
          .put('/api/budgets')
          .send(invalidBudgets)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('Expenses API', () => {
    const mockExpenses = [
      { id: 1, date: '2026-06-03', description: 'Lunch', category: 'Food', amount: 450.00, note: 'Pizza' },
      { id: 2, date: '2026-06-02', description: 'Metro', category: 'Transport', amount: 300.00, note: '' }
    ];

    describe('GET /api/expenses', () => {
      it('should return 200 and all expenses', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);

        const response = await request(app)
          .get('/api/expenses')
          .expect(200);

        expect(response.body).toHaveLength(2);
        expect(response.body[0].description).toBe('Lunch');
      });

      it('should filter expenses by category', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);

        const response = await request(app)
          .get('/api/expenses?category=Food')
          .expect(200);

        expect(response.body).toHaveLength(1);
        expect(response.body[0].category).toBe('Food');
      });
    });

    describe('POST /api/expenses', () => {
      it('should successfully create an expense and return 201', async () => {
        dbHelper.readExpenses.mockResolvedValue([]);
        dbHelper.writeExpenses.mockResolvedValue();

        const newExpense = {
          date: '2026-06-05',
          description: 'Office Snacks',
          category: 'Food',
          amount: 120.00,
          note: 'Shared'
        };

        const response = await request(app)
          .post('/api/expenses')
          .send(newExpense)
          .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.description).toBe('Office Snacks');
        expect(dbHelper.writeExpenses).toHaveBeenCalledTimes(1);
      });

      it('should return 400 if expense validation fails', async () => {
        const invalidExpense = {
          date: '2026-06-05',
          description: '', // Empty description
          category: 'Food',
          amount: -50.00 // Negative amount
        };

        const response = await request(app)
          .post('/api/expenses')
          .send(invalidExpense)
          .expect(400);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('PUT /api/expenses/:id', () => {
      it('should successfully update an existing expense', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);
        dbHelper.writeExpenses.mockResolvedValue();

        const updatedData = {
          date: '2026-06-03',
          description: 'Expensive Lunch',
          category: 'Food',
          amount: 900.00,
          note: 'Buffet'
        };

        const response = await request(app)
          .put('/api/expenses/1')
          .send(updatedData)
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data.description).toBe('Expensive Lunch');
        expect(response.body.data.amount).toBe(900.00);
        expect(dbHelper.writeExpenses).toHaveBeenCalledTimes(1);
      });

      it('should return 404 if expense to update does not exist', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);

        const updatedData = {
          date: '2026-06-03',
          description: 'Expensive Lunch',
          category: 'Food',
          amount: 900.00,
          note: ''
        };

        const response = await request(app)
          .put('/api/expenses/999')
          .send(updatedData)
          .expect(404);

        expect(response.body).toHaveProperty('error');
      });
    });

    describe('DELETE /api/expenses/:id', () => {
      it('should successfully delete an existing expense', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);
        dbHelper.writeExpenses.mockResolvedValue();

        const response = await request(app)
          .delete('/api/expenses/1')
          .expect(200);

        expect(response.body).toHaveProperty('message');
        expect(dbHelper.writeExpenses).toHaveBeenCalledTimes(1);
      });

      it('should return 404 if expense to delete does not exist', async () => {
        dbHelper.readExpenses.mockResolvedValue(mockExpenses);

        const response = await request(app)
          .delete('/api/expenses/999')
          .expect(404);

        expect(response.body).toHaveProperty('error');
      });
    });
  });

  describe('GET /api/expenses/stats', () => {
    it('should return correct monthly comparison stats', async () => {
      // Mock expenses spanning June 2026 and May 2026
      const mockStatsExpenses = [
        // Current Month (June 2026)
        { id: 1, date: '2026-06-05', description: 'Bill', category: 'Bills', amount: 1000.00 },
        { id: 2, date: '2026-06-04', description: 'Food', category: 'Food', amount: 500.00 },
        // Previous Month (May 2026)
        { id: 3, date: '2026-05-05', description: 'Prev Bill', category: 'Bills', amount: 800.00 },
        { id: 4, date: '2026-05-04', description: 'Prev Food', category: 'Food', amount: 400.00 }
      ];

      dbHelper.readExpenses.mockResolvedValue(mockStatsExpenses);
      dbHelper.readBudgets.mockResolvedValue({
        Food: 5000,
        Transport: 3000,
        Bills: 3000,
        Entertainment: 2000,
        Other: 1500
      });

      // Request stats for June 2026 range
      const response = await request(app)
        .get('/api/expenses/stats?startDate=2026-06-01&endDate=2026-06-30')
        .expect(200);

      // Verify calculation correctness
      expect(response.body.totalSpent).toBe(1500.00);
      expect(response.body.totalCount).toBe(2);
      expect(response.body.spentChange).toBe(25); // (1500-1200)/1200 * 100
      expect(response.body.countChange).toBe(0);
    });
  });
});
