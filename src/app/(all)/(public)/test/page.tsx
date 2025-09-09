"use client";
import { fetchStock } from "@/actions/stock_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { set, z } from "zod";
import { handleSearch } from "@/actions/formValidation";
import {
  createStock,
  findTicker,
  findDistinctTickers,
  addFunds,
} from "@/actions/prisma_api";
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



export default function TestPage() {

  const SearchSchema = z.object({
    ticker: z.string().min(1, "Ticker is required"),
    stockPrice: z.number().min(0.01, "Stock price must be at least 0.01"),
    totalSharesOwned: z.number("The total shares owned must be a number"),
    accountStocks: z.number().max(4, "You can only own 4 different stocks"),
    buyOrders: z.number().max(3, "Quantity must be at most 3"),
  });

  type Props = z.infer<typeof SearchSchema>;

    const [stockData, setStockData] = useState<Array<Props>>([]);

  // Wrap handleSearch to ensure it returns Promise<void>
  const handleFormAction = async (formData: FormData) => {
    const Data = await handleSearch(formData);
    setStockData(Data);
    // Optionally handle result or errors here
  };

  return (
    <>
      <form action={handleFormAction}>
        <input type="text" name="ticker" placeholder="Ticker" required/>
        <button type="submit">Search</button>
      </form>
      <div>Ticker: {stockData[0]?.ticker}</div>
      <div>Stock Price: {stockData[0]?.stockPrice}</div>
      <div>Total Shares Owned: {stockData[0]?.totalSharesOwned}</div>
      <div>Account Stocks: {stockData[0]?.accountStocks}</div>
      <div>Buy Orders: {stockData[0]?.buyOrders}</div>
    </>
  );
}
