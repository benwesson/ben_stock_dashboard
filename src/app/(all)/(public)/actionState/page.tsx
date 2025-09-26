"use client";
import handleSell  from "@/actions/sellActions";
import PopulateSell from "@/actions/populateSell";
import { useActionState,useEffect } from "react";
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



export default function ActionStatePage() {
useEffect(() => {
  async function fetchStocks() {
    const stocks = await PopulateSell();
    console.log("Fetched stocks:", stocks);
  }
  fetchStocks();
}, []);
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Sell Shares</CardTitle>
        <CardDescription>Enter the quantity of shares you want to sell.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSell}>
         

            <Input type="number" placeholder="Quantity of shares to sell:" />
            <Button className="mt-4" type="submit">Sell</Button>
        </form>
      </CardContent>
    </Card>
  );
}
