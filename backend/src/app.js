import './env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import expenseRoutes from './routes/expenses.js';

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default app;
