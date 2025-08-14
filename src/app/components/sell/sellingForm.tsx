"use client";
import { useMemo, useState } from "react";
import styles from "@/components/sell/sell.module.css";
import { sellStock, deleteStock } from "@/api/prisma_api";
import { FormEvent } from "react";
type Stock = { ticker: string; quantity: number; price: number };

const handleSell = async (e: FormEvent<HTMLFormElement>) => {
  // e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const sellQuantity = Number(formData.get("sellQuantity"));
  const ownedQuantity = Number(formData.get("ownedQuantity"));
  const sellTicker = String(formData.get("sellTicker"));
  const newQuantity = ownedQuantity - sellQuantity;
  if (newQuantity === 0) {
    alert(`You have sold all shares of ${sellTicker}.`);
    await deleteStock(sellTicker);
  } else {
    try {
      await sellStock(sellTicker, newQuantity);
      console.log(`Sold ${sellQuantity} shares of ${sellTicker} at `);
      alert(`Sold ${sellQuantity} shares of ${sellTicker} at  `);
    } catch (error) {
      console.error("Error selling stock:", error);
    }
  }
};

function SellStats({ stock }: { stock: Stock }) {
  return (
    <form onSubmit={handleSell}>
      <div id="sellTicker">Sell Stats for </div>
      <input type="hidden" name="sellTicker" value={stock.ticker}></input>
      <p>Quantity Owned: {stock.quantity}</p>
      <input type="hidden" name="ownedQuantity" value={stock.quantity}></input>
      <p>Average Purchase Price: ${stock.price.toFixed(2)}</p>
      <label>
        Quantity to Sell:
        <input
          type="number"
          name="sellQuantity"
          max={stock.quantity}
          min={1}
          required
        ></input>
        <button type="submit">Sell</button>
      </label>
    </form>
  );
}

export default function SellForm({ stocks }: { stocks: Stock[] }) {
  const [selectedTicker, setSelectedTicker] = useState(stocks[0]?.ticker ?? "");

  // Optional O(1) lookup by ticker
  const stocksByTicker = useMemo(
    () => Object.fromEntries(stocks.map((s) => [s.ticker, s] as const)),
    [stocks]
  );

  const selectedStock = stocksByTicker[selectedTicker];

  return (
    <div className={styles.sell}>
      <div>Sell Stocks</div>

      <label htmlFor="ticker">Select Ticker:</label>
      <select
        id="ticker"
        value={selectedTicker}
        onChange={(e) => setSelectedTicker(e.target.value)}
      >
        {stocks.map((s) => (
          <option key={s.ticker} value={s.ticker}>
            {s.ticker}
          </option>
        ))}
      </select>

      {selectedStock && <SellStats stock={selectedStock} />}
    </div>
  );
}
