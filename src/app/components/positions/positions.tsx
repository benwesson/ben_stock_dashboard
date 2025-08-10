import styles from '@/components/positions/positions.module.css';
import Link from 'next/link';
export default function Positions() {
  const stockTicker = "AAPL"; // Example stock ticker
  const stockQuantity = 10; // Example quantity of stocks 
  const stockPrice = 150; // Example price per stock
  const marketValue = stockQuantity * stockPrice; // Calculate market value
  const percentageOfHoldings = 20; // Example percentage of holdings
  return (
    
    <div>
      <h2>Positions</h2>
      <p>List of stock positions will be displayed here.</p>
      <Link href="/trade">
        <button>Add Stock</button>
      </Link>

    </div>
  );
}    