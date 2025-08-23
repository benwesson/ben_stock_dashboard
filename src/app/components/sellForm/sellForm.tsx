"use client";
import { useState } from "react";
import { updateStock, deleteStock, addFunds } from "@/api/prisma_api";
import { Button, Input, } from "@chakra-ui/react";

type Stock = { ticker: string; quantity: number; price: number };

type SellFormProps = {
  email: string;
  stocks: Stock[];
  funds: number;
  stockPrices: { [key: string]: { data: { close: number }[] } };
};


export default function SellForm({ email, stocks, funds, stockPrices }: SellFormProps) {

  const [selectedTicker, setSelectedTicker] = useState<string>("none");
  const [selectedQuantity, setSelectedQuantity] = useState<number>(0);
  const [selectedPrice, setSelectedPrice] = useState<number>(0);

    const handleSell = async (event: React.FormEvent<HTMLFormElement>) => {
      
        const formData = new FormData(event.currentTarget);
        const sellQuantity = formData.get("sellQuantity"); 
        const newQuantity = selectedQuantity - (sellQuantity ? Number(sellQuantity) : 0);
        const currentPrice = formData.get("currentPrice");
        const newFunds = funds + (currentPrice ? Number(currentPrice) * Number(sellQuantity) : 0);

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
            setSelectedTicker(selectedStock.ticker.toUpperCase());
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
        <div>Current Price: {stockPrices[selectedTicker]?.data[0]?.close.toFixed(2) || 0}</div>
        <input type="hidden" name="currentPrice" value={stockPrices[selectedTicker]?.data[0]?.close || 0} />
        <Input type="number" placeholder="Quantity" name="sellQuantity" min={1} max={selectedQuantity} required/>
        <Button type="submit">Sell</Button>
      </form>
    </div>
  );
}