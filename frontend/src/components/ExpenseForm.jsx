import { useState } from 'react';

export default function ExpenseForm({ onSubmit }) {
  const [purpose, setPurpose] = useState('');
  const [amount, setAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!purpose.trim()) {
      setError('Purpose is required');
      return;
    }
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) {
      setError('Please enter a valid amount');
      return;
    }
    setLoading(true);
    try {
      await onSubmit({ purpose: purpose.trim(), amount: num, expenseDate });
      setPurpose('');
      setAmount('');
      setExpenseDate(new Date().toISOString().slice(0, 10));
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card expense-form">
      <h2>Add Expense</h2>
      <form onSubmit={handleSubmit}>
        {error && <div className="error">{error}</div>}
        <div className="form-row">
          <input
            type="text"
            placeholder="Purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            required
          />
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <input
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add'}
          </button>
        </div>
      </form>
    </section>
  );
}
