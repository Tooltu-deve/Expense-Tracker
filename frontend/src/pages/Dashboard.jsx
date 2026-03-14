import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import MonthlySummary from '../components/MonthlySummary';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  });

  const loadExpenses = async () => {
    try {
      const data = await api.get(`/expenses?month=${month}`);
      setExpenses(data.expenses || []);
    } catch (err) {
      setExpenses([]);
    }
  };

  const loadSummary = async () => {
    try {
      const data = await api.get(`/expenses/summary?month=${month}`);
      setSummary(data);
    } catch (err) {
      setSummary(null);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadExpenses(), loadSummary()]).finally(() => setLoading(false));
  }, [month]);

  const handleAddExpense = async (expense) => {
    await api.post('/expenses', expense);
    loadExpenses();
    loadSummary();
  };

  const handleDeleteExpense = async (id) => {
    await api.delete(`/expenses/${id}`);
    loadExpenses();
    loadSummary();
  };

  return (
    <div className="dashboard">
      <header className="header">
        <h1>Expense Tracker</h1>
        <div className="user-bar">
          <span>{user?.email}</span>
          <button onClick={logout} className="btn-logout">Logout</button>
        </div>
      </header>

      <main className="main">
        <ExpenseForm onSubmit={handleAddExpense} />
        <div className="filters">
          <label>Month:</label>
          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>
        <MonthlySummary summary={summary} loading={loading} />
        <ExpenseList expenses={expenses} onDelete={handleDeleteExpense} loading={loading} />
      </main>
    </div>
  );
}
