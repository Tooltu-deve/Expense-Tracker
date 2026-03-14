export default function ExpenseList({ expenses, onDelete, loading }) {
  if (loading) {
    return (
      <section className="card expense-list">
        <h2>Expenses</h2>
        <p className="muted">Loading...</p>
      </section>
    );
  }

  if (!expenses || expenses.length === 0) {
    return (
      <section className="card expense-list">
        <h2>Expenses</h2>
        <p className="muted">No expenses yet. Add one above.</p>
      </section>
    );
  }

  return (
    <section className="card expense-list">
      <h2>Expenses</h2>
      <ul className="expense-items">
        {expenses.map((exp) => (
          <li key={exp.id} className="expense-item">
            <div className="expense-info">
              <span className="purpose">{exp.purpose}</span>
              <span className="date">{exp.expenseDate}</span>
              <span className="amount">${parseFloat(exp.amount).toFixed(2)}</span>
            </div>
            <button
              type="button"
              className="btn-delete"
              onClick={() => onDelete(exp.id)}
              title="Delete"
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
