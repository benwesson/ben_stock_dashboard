import { useEffect, useState } from "react";
import { getQuantitiesByTicker } from "@/actions/prisma_api";
import { findTicker, findDistinctTickers } from "@/actions/prisma_api";
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

export default async function SellTestPage() {
  const quantities = await getQuantitiesByTicker();
  console.log("Quantities for ticker:", quantities);

  return (
    <Card className="mt-8">
      <CardContent>
        <CardTitle className="mb-4">Sell Shares</CardTitle>
        <form>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stock to sell" />
            </SelectTrigger>
            <SelectContent>
              {quantities.map((item) => (
                <SelectItem key={item.ticker} value={item.ticker}>
                  {item.ticker} - {item.quantity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Quantity to sell"
            min="1"
            max="100"
            className="mt-4 w-[180px]"
          />
          <Button type="submit" className="mt-4 ">
            Sell
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
