"use client";
import { useState } from "react";
import sellAction from "@/actions/sellActions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SellTestPage({
  stockData,
}: {
  stockData: { ticker: string; quantity: number; price: number; id: number }[];
}) {
  const [selectedStock, setSelectedStock] = useState<string>("");
  function handleChange(value: string) {
    setSelectedStock(value);
    console.log("Selected stock:", value);
  }
  if (!stockData) {
    return <div>You do not own any stocks to sell.</div>;
  }
  // Unique, uppercased tickers
  const stockList = Array.from(
    new Set(stockData.map((s) => s.ticker.toUpperCase()))
  );

  const filteredStocks = stockData.filter(
    (s) => s.ticker.toUpperCase() === selectedStock
  );

  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Sell Shares</CardTitle>
          <CardDescription>
            Select an owned stock to sell shares of
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <Select value={selectedStock} onValueChange={handleChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a stock to sell" />
              </SelectTrigger>
              <SelectContent>
                {stockList.map((stock) => (
                  <SelectItem key={stock} value={stock}>
                    {stock}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </form>
        </CardContent>
      </Card>
      {selectedStock && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Orders of {selectedStock}:</CardTitle>
            <CardDescription>
              Provide order ID to sell and quantity of shares to sell
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Purchased Price</TableHead>
                  <TableHead>Current Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.id}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.price}</TableCell>
                    <TableCell>temp</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <form action={sellAction}>
              <Input
                type="number"
                placeholder="Order ID to sell"
                min="1"
                max="100"
                className="mt-4 w-[180px]"
                name="orderIDToSell"
                required
              />
              <Input
                type="number"
                placeholder="Quantity to sell"
                min="1"
                max="100"
                className="mt-4 w-[180px]"
                name="sharesToSell"
                required
              />
              <Button type="submit" className="mt-4 mr-4">
                Sell
              </Button>
              <Button>Sell All</Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
