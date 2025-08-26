"use client";
import { fetchStock } from "@/api/stock_api";
import { Button, Input } from "@chakra-ui/react";
import {
  createStock,
  findTicker,
  updateStock,
  addFunds,
  getFunds,
} from "@/api/prisma_api";
import { useState } from "react";
type BuyFormProps = { email: string; funds: number };
export default function BuyForm({ email, funds }: BuyFormProps) {
  const [stockTicker, setStockTicker] = useState<string>("none");
  const [stockPrice, setStockPrice] = useState<number>(0);
  const [ownedStocks, setOwnedStocks] = useState<number>(0);
  
  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
    //Get ticker from input in form
    const formData = new FormData(event.currentTarget);
    const formTicker = formData.get("ticker") as string;

    event.preventDefault();

    try {
     
      //fetch stock from marketstack
      const stock = await fetchStock(formTicker);
      //Check if you own the stock
      const existingTicker = await findTicker(formTicker, email);
      if (existingTicker) {
        setOwnedStocks(existingTicker.quantity);
      }
      //set the stock price
      setStockPrice(stock.data[0].close);
      //Get stock ticker so other form can use it
      setStockTicker(formTicker);
    } catch (error) {
      alert("Stock not found");
    }
  };

  const handleBuy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //Get qunatity from input in form
    const formData = new FormData(event.currentTarget);
    const formQuantity = Number(formData.get("quantity"));

    //If you already own the stock
    // if (ownedStocks > 0) {
    //   const newQuantity = ownedStocks + formQuantity;

    //   try {
    //     const newFunds = funds - formQuantity * stockPrice;
    //     if (newFunds > funds) {
    //       alert("Insufficient funds");
    //     } else {
    //       await updateStock(stockTicker, newQuantity, email);
    //       await addFunds(email, newFunds);

    //       alert(
    //         `Successfully bought ${formQuantity} shares of ${stockTicker} your balance is ${newFunds.toFixed(
    //           2
    //         )}`
    //       );
    //     }
    //   } catch (error) {
    //     alert("Error updating stock");
    //   }
    // }
    
    //If you don't own the stock
    
      try {
        const newFunds = funds - formQuantity * stockPrice;

        if (newFunds > funds) {
          alert("Insufficient funds");
          
        }else {
        await createStock(stockTicker, formQuantity, stockPrice, email);
        await addFunds(email, newFunds);
          alert(
          `Successfully bought ${formQuantity} shares of ${stockTicker} your balance is ${newFunds.toFixed(
            2
          )}`
        );

        }
        
      } catch (error) {
        alert("Error creating stock");
      }
    
  };

  return (
    <div>
      <p>Signed in as: {email}</p>
      <h1>Search for Stocks</h1>
      <form onSubmit={handleSearch}>
        <Input type="text" placeholder="Ticker" name="ticker" required />
        <Button type="submit">Search</Button>
      </form>

      <form onSubmit={handleBuy}>
        <h1>Buy Shares</h1>
        <div>Currently Owned Shares: {ownedStocks}</div>
        <div>Ticker: {stockTicker}</div>
        <div>Price: {stockPrice}</div>
        <Input type="number" placeholder="Quantity" name="quantity" />
        <Button type="submit">Buy</Button>
      </form>
    </div>
  );
}
