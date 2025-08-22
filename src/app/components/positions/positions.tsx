
type Stock = { ticker: string; quantity: number; price: number };
export default function Positions({ stocks }: { stocks: Stock[] }) {
  return (
    <div>
      <h1>Your Positions</h1>
      {stocks.length > 0 ? (
        <ul>
          {stocks.map((stock) => (
            <li key={stock.ticker}>
              {stock.ticker}: {stock.quantity} shares at ${stock.price.toFixed(2)}
            </li>
          ))}
        </ul>
      ) : (
        <p>No positions found.</p>
      )}

      
    </div>
  );
}