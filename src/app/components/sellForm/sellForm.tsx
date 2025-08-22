"use client";
import { useState } from "react";
import { updateStock, deleteStock, addFunds } from "@/api/prisma_api";
type Stock = { ticker: string; quantity: number; price: number };

type SellFormProps = {
  email: string;
  stocks: Stock[];
  funds: number;
};

export default function SellForm({ email, stocks, funds }: SellFormProps) {
    const [selectedTicker, setSelectedTicker] = useState<string>("none");
    const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
    const [selectedPrice, setSelectedPrice] = useState<number>(0);

    const handleSell = async (event: React.FormEvent<HTMLFormElement>) => {
      
        const formData = new FormData(event.currentTarget);
        const sellQuantity = formData.get("sellQuantity"); 
        const newQuantity = selectedQuantity - (sellQuantity ? Number(sellQuantity) : 0);
        const newFunds = funds + (selectedPrice * Number(sellQuantity));
        if (newQuantity === 0) {
            try {
                await deleteStock(selectedTicker, email);
                await addFunds(email, newFunds);
                alert(`Successfully sold all shares of ${selectedTicker} and your balance is now ${newFunds}.`);
                
            } catch (error) {
                console.error("Error deleting stock:", error);
            }
        } else {
            try {
                await updateStock(selectedTicker, newQuantity, email);
                await addFunds(email, newFunds);
                alert(`Successfully sold ${sellQuantity} shares of ${selectedTicker} and still own ${newQuantity} shares and your balance is now ${newFunds}.`);
            } catch (error) {
                console.error("Error updating stock:", error);
            }
        }


    }

    const handleSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedStock = stocks.find(stock => stock.ticker === event.target.value);
        if (selectedStock) {
            setSelectedTicker(selectedStock.ticker);
            setSelectedQuantity(selectedStock.quantity);
            setSelectedPrice(selectedStock.price);
        }
    }

    return (
    <div>
      <p>Signed in as: {email}</p>
      <h1>Choose Stock</h1>
      <form onSubmit={handleSell}>
        <select name="ticker" onChange={(e) => handleSelect(e)} required>
          <option value="">Select a stock to sell</option>
          {stocks.map((stock) => (
            <option key={stock.ticker} value={stock.ticker}>
              {stock.ticker} - {stock.quantity} shares
            </option>
          ))}
        </select>
        <h1>Sell Shares</h1>
        <div>Ticker: {selectedTicker}</div>
        <div>Owned Quantity: {selectedQuantity}</div>
        <div>Bought At: {selectedPrice}</div>

        <input type="number" placeholder="Quantity" name="sellQuantity" min={1} max={selectedQuantity} required/>
        <button type="submit">Sell</button>
      </form>
    </div>
  );
}