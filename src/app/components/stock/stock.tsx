import styles from '@/components/stock/stock.module.css';

export default function Stock(data: any) {
  const stockTicker = "AAPL"; // Example stock ticker
  const stockQuantity = 10; // Example quantity of stocks 
  const stockPrice = 150; // Example price per stock
  const marketValue = stockQuantity * stockPrice; // Calculate market value
  const percentageOfHoldings = 20; // Example percentage of holdings
  return (
    
    <div>
      <h2>Positions</h2>
      <p>List of stock positions will be displayed here.</p>
      <div className={styles.stock}>
        <p>Ticker: {stockTicker}</p>
        <p>Quantity: {stockQuantity}</p>
        <p>Price: {stockPrice} </p>
        <p>Market Vlaue: {marketValue}</p>
        <p>% of Holdings: {percentageOfHoldings}</p>
      </div>
      
    </div>
  );
} 