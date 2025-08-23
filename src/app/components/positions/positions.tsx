type Stock = { ticker: string; quantity: number; price: number };
type StockPrices = { [key: string]: { data: { close: number }[] } };

export default function Positions({ stocks, stockPrices }: { stocks: Stock[]; stockPrices: StockPrices }) {
  console.log("Stock Prices in Positions:", stockPrices.data);
  return (
    <div>
      <h1>Your Positions</h1>
      {stocks.length > 0 ? (
        <ul>
          {stocks.map((stock) => (
            <li key={stock.ticker}>
              {stock.ticker}: {stock.quantity} bought at ${stock.price.toFixed(2)} | Current Price: ${stockPrices[stock.ticker.toUpperCase()]?.data[0]?.close.toFixed(2) || "N/A"}
            </li>
          ))}
        </ul>
      ) : (
        <p>No positions found.</p>
      )}

      
    </div>
  );
}