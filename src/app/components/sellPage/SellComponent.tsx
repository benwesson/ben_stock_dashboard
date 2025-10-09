"use client";
import { useState, useActionState } from "react";
import { SellActionState } from "@/actions/sellActions";
import sellAction from "@/actions/sell/sellActions";
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

const initialFormState: SellActionState = {
  orderID: "",
  quantity: "",
};
export default function SellComponent({
  stockData,
}: {
  stockData: { id: number; ticker: string; quantity: number; boughtAt: number; currentPrice: number; summary: string }[];
}) {
    const [state, formAction, pending] = useActionState(
        sellAction,
        initialFormState
      );
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
                  <TableHead>Purchase Price</TableHead>
                  <TableHead>Current Price</TableHead>
                  <TableHead>Gain/Loss</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.id}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.boughtAt}</TableCell>
                    <TableCell>{stock.currentPrice}</TableCell>
                    <TableCell>{(stock.currentPrice - stock.boughtAt).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <form action={formAction}>
              <input type="hidden" name="currentPrice" value={filteredStocks[0]?.currentPrice} />
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
            {pending ? (
                      <div>Loading...</div>
                    ) : state.errors ? (
                      <div style={{ color: "red" }}>
                        {Object.values(state.errors).map((error, index) => (
                          <div key={index}>{error}</div>
                        ))}
                      </div>
                    ) : (
                      state.orderID && (
                        <>
                          <div>Order ID: {state.orderID}</div>
                          
                        </>
                      )
                    )}
            
          </CardContent>
        </Card>
      )}
    </>
  );
}
