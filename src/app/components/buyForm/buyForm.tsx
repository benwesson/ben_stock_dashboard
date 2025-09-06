"use client";
import { fetchStock } from "@/api/stock_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createStock,
  findTicker,
  findDistinctTickers,
  addFunds,
} from "@/api/prisma_api";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type BuyFormProps = { email: string; funds: number };
export default function BuyForm({ email, funds }: BuyFormProps) {
  const [stockTicker, setStockTicker] = useState<string>("none");
  const [stockPrice, setStockPrice] = useState<number>(0);
  const [ownedStocks, setOwnedStocks] = useState<number>(0);
  const [orders, setOrders] = useState<number>(0);

  const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
     event.preventDefault();
    //Get ticker from input in form
    const formData = new FormData(event.currentTarget);
    const formTicker = formData.get("ticker") as string;
    const distinctTickers = await findDistinctTickers(email);
    console.log("Distinct Tickers in Buy Form:", distinctTickers.length);
    

    if (distinctTickers.length >= 4) {
      alert(
        "You have reached the maximum number of different stocks you can own. You must sell an existing stock to buy a new one."
      );
      return;
    } else {
      try {
        //fetch stock from marketstack
        const stock = await fetchStock(formTicker);
        //set the stock price
        setStockPrice(stock.data[0].close);
        //Get stock ticker so other form can use it
        setStockTicker(formTicker);
      } catch (error) {
        alert("Stock not found");
      }
    }

    //Check if you own the stock
    const existingTicker = await findTicker(formTicker, email);
    //Check how many orders of that stock have been made
    const existingTickerLength = existingTicker.length;
    setOrders(existingTickerLength);
    console.log({ existingTickerLength });

    //If you own the stock and own less than 3 orders you can buy up to 3 orders
    if (existingTickerLength > 0 && existingTickerLength < 3) {
      console.log("You own this stock and can buy more shares");
      //get shares from first order and second order if it exists
      const currentlyOwnedShareCalc =
        (existingTicker[0]?.quantity ?? 0) + (existingTicker[1]?.quantity ?? 0);
      setOwnedStocks(currentlyOwnedShareCalc);
    }
    //if you don't own the stock you can buy a order
    else if (existingTickerLength === 0) {
      console.log("You don't own this stock and can buy shares");
      setOwnedStocks(0);
    }
    //if you have placed 3 orders you cannont place more
    else {
      //In this condition we assume you own 3 orders
      console.log("You own this stock and can't buy more shares");
      const currentlyOwnedShareCalc =
        existingTicker[0].quantity +
        existingTicker[1].quantity +
        existingTicker[2].quantity;
      setOwnedStocks(currentlyOwnedShareCalc);
      alert(
        "You have reached the maximum number of orders for this stock. You must sell of an existing order of shares to place a new order."
      );
    }
   
  };

  const handleBuy = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //Get qunatity from input in form
    const formData = new FormData(event.currentTarget);
    const formOrders = Number(formData.get("orders"));
    const formQuantity = Number(formData.get("quantity"));

    if (
      formOrders < 3 &&
      formQuantity > 0 &&
      stockTicker !== "none" &&
      stockPrice > 0
    ) {
      try {
        const newFunds = funds - formQuantity * stockPrice;

        if (newFunds > funds) {
          alert("Insufficient funds");
        } else {
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
    } else {
      alert("You have reached the maximum number of orders for this stock.");
    }
  };

  return (
    <Card className="mt-8">
      <CardContent>
        <p>Signed in as: {email}</p>
        <h1>Search for Stocks</h1>
        
        <form onSubmit={handleSearch}>
          <Input type="text" placeholder="Ticker" name="ticker" required />
          <Button className="mt-4" type="submit">Search</Button>
        </form>

        <form onSubmit={handleBuy}>
          <h1>Buy Shares</h1>
          <div>Buy orders placed: {orders}</div>
          <div>Currently Owned Shares: {ownedStocks}</div>

          <div>Ticker: {stockTicker}</div>
          <div>Price: {stockPrice}</div>
          <Input type="number" placeholder="Quantity" name="quantity" min={1} />
          <Button className="mt-4" type="submit">Buy</Button>
        </form>
        
      </CardContent>
    </Card>
  );
}
