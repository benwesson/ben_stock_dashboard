"use client";
import { createStock, findTicker, updateStock } from "@/api/prisma_api"; // Fixed import path
import { useState } from "react";
import styles from "@/components/buy/buy.module.css";
import { fetchStock } from "@/api/stock_api"; // Fixed import path
import { FormEvent } from "react";

export default function Buy() {
  const [showBuyForm, setShowBuyForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      
     
      console.log("Fetching stock data for:", ticker);
      const response = await fetchStock(ticker);
      console.log("Full response:", response);
      
      // MarketStack API response structure
      if (response && response.data && response.data.length > 0) {
        const stockData = response.data[0]; // MarketStack uses 'data' not 'results'
        
        // MarketStack API fields
        const currentPrice = stockData.close 
        setPrice(currentPrice);
        
        console.log("Stock Data:", {
          symbol: stockData.symbol,
          open: stockData.open,
          high: stockData.high,
          low: stockData.low,
          close: stockData.close,
          volume: stockData.volume,
          date: stockData.date
        });
        
        setShowBuyForm(true);
      } else {
        setError("No stock data found for this ticker");
        console.error("No stock data found");
      }
      
    } catch (error) {
      console.error("Error fetching stock:", error);
      setError("Failed to fetch stock data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    //rules about onChange and numbers so we can use the formData
    const formData = new FormData(e.currentTarget);
    const buyQuantity = Number(formData.get("quantity"));
    //Check if stock ticker already exists
    const existingTicker = await findTicker(ticker);
    //Already owned stock, so we can update the quantity
    if  (existingTicker) {
      const newQuantity = existingTicker.quantity + buyQuantity; 
      try {
        await updateStock(ticker, newQuantity,price);
        alert(`Successfully bought ${buyQuantity} shares of ${ticker} `);
        console.log("Buying stocks:", ticker, buyQuantity);
        
      } catch (error) {
        console.error("Error buying stock:", error);
        alert("Failed to buy stock. Please try again.");
      }

    }
    //Don't own stock, so we can create a new stock entry
    else {
        try {
        console.log("Buying stocks:", ticker,  buyQuantity);
        await createStock(ticker,  buyQuantity, price);
        alert(`Successfully bought ${buyQuantity} shares of ${ticker} at`);
        // setQuantity(buyQuantity);
      } catch (error) {
        console.error("Error buying stock:", error);
        alert("Failed to buy stock. Please try again.");
      }

    }
    
   
  };

  return (
    <>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Enter stock ticker"
          value={ticker}
          onChange={(e) => setTicker(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </button>
      </form>
      
      {error && (
        <div style={{ color: 'red', margin: '10px 0' }}>
          {error}
        </div>
      )}
      
      <div>
        <h2>Buy Stocks</h2>
        
        <form
          className={styles.buyForm}
          style={{ display: showBuyForm ? "block" : "none" }}
          onSubmit={handleBuy}
        >
          <label>
            Stock Ticker:
            <div>{ticker}</div>
          </label> 
          <label>
            Current Price:
            <div>{price}</div>
          </label> 
          <label>
            Quantity:
            <input 
              type="number" 
              name="quantity" 
              min="1"
              required 
            />
          </label>
          <button type="submit">Buy</button>
        </form>
      </div>
    </>
  );
}

