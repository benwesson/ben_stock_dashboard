import styles from '@/components/buy/buy.module.css';
export default function Buy() {
  return (
    <div>
      <h2>Buy Stocks</h2>
      <p>Form to buy stocks will be displayed here.</p>
      {/* Add form elements for buying stocks */}
      <form className={styles.buyForm}>
        <label>
          Stock Ticker:
          <input type="text" name="ticker" required />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" required />
        </label>
        <button type="submit">Buy</button>
        </form>
    </div>
  );
}