import express from 'express';
import pool from '../config/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

// Add expense
router.post('/', async (req, res) => {
  try {
    const { purpose, amount, expenseDate } = req.body;
    const userId = req.userId;

    if (!purpose || amount == null) {
      return res.status(400).json({ error: 'Purpose and amount are required' });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    const date = expenseDate ? new Date(expenseDate).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);

    const [result] = await pool.query(
      'INSERT INTO expenses (user_id, purpose, amount, expense_date) VALUES (?, ?, ?, ?)',
      [userId, purpose, amountNum, date]
    );

    res.status(201).json({
      id: result.insertId,
      purpose,
      amount: amountNum,
      expenseDate: date,
    });
  } catch (err) {
    console.error('Add expense error:', err);
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

// Get all expenses (with optional month filter as YYYY-MM)
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;
    const { month } = req.query;

    let query = 'SELECT id, purpose, amount, expense_date as expenseDate, created_at as createdAt FROM expenses WHERE user_id = ?';
    const params = [userId];

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, mon] = month.split('-').map(Number);
      query += ' AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?';
      params.push(mon, year);
    }

    query += ' ORDER BY expense_date DESC, id DESC';

    const [rows] = await pool.query(query, params);

    res.json({ expenses: rows });
  } catch (err) {
    console.error('Get expenses error:', err);
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

// Get monthly summary (optional month as YYYY-MM returns total for that month)
router.get('/summary', async (req, res) => {
  try {
    const userId = req.userId;
    const { month } = req.query;

    if (month && /^\d{4}-\d{2}$/.test(month)) {
      const [year, mon] = month.split('-').map(Number);
      const [rows] = await pool.query(
        `SELECT COALESCE(SUM(amount), 0) as total
         FROM expenses
         WHERE user_id = ? AND MONTH(expense_date) = ? AND YEAR(expense_date) = ?`,
        [userId, mon, year]
      );
      return res.json({ total: parseFloat(rows[0].total) });
    }

    const targetYear = new Date().getFullYear();
    const [rows] = await pool.query(
      `SELECT MONTH(expense_date) as month, SUM(amount) as total
       FROM expenses
       WHERE user_id = ? AND YEAR(expense_date) = ?
       GROUP BY MONTH(expense_date)
       ORDER BY month`,
      [userId, targetYear]
    );

    const summary = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, total: 0 }));
    rows.forEach((r) => {
      summary[r.month - 1].total = parseFloat(r.total);
    });
    res.json({ year: targetYear, months: summary });
  } catch (err) {
    console.error('Get summary error:', err);
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Delete expense
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    const [result] = await pool.query(
      'DELETE FROM expenses WHERE id = ? AND user_id = ?',
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    console.error('Delete expense error:', err);
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
