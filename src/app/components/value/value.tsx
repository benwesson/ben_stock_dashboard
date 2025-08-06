

export default function Value() {
  const totalValue = 10000; // Example total value of the portfolio
  const cashValue = 2000; // Example cash value in the portfolio
  const stockValue = totalValue - cashValue; // Calculate stock value
  const percentageChange = 5; // Example percentage change in value

  return (
    <div>
      <h2>Portfolio Value</h2>
      <p>Total Value: ${totalValue}</p>
      <p>Cash Value: ${cashValue}</p>
      <p>Stock Value: ${stockValue}</p>
      <p>Percentage Change: {percentageChange}%</p>
    </div>
  );
}