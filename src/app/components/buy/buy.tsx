"use client";
import { useState } from 'react';
import styles from '@/components/buy/buy.module.css';
import fetchStock from '@/api/api'; // Assuming you have an API function to fetch stock data
import { FormEvent } from 'react';
export default function Buy() {
  const [showBuyForm, setShowBuyForm] = useState(false);
  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    console.log('good fetch')
    // fetchStock(formData.get("ticker"));
    setShowBuyForm(true);
  };

  return (
    <>
      <form onSubmit ={handleSearch}>
        <input type="text" placeholder="Enter stock ticker" name="ticker" />
        <button type="submit">Search</button>
      </form>
      <div>
        <h2>Buy Stocks</h2>
        <p>Form to buy stocks will be displayed here.</p>
        {/* Add form elements for buying stocks */}
        
        <form className={styles.buyForm}
        style={{ display: showBuyForm ? 'block' : 'none' }}>
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
    </>
    
    
  );
}