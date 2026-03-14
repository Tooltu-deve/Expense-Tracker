export default function MonthlySummary({ summary, loading }) {
  if (loading) {
    return (
      <section className="card summary">
        <h2>Monthly Summary</h2>
        <p className="muted">Loading...</p>
      </section>
    );
  }

  const total = summary?.total ?? 0;
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(total);

  return (
    <section className="card summary">
      <h2>Monthly Summary</h2>
      <p className="total-amount">{formattedTotal}</p>
    </section>
  );
}
