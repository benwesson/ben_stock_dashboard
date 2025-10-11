"use client";

import { addFunds } from "@/actions/prisma_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DepositFunds() {
  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Deposit Funds</CardTitle>
          <CardDescription>Add funds to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex gap-2">
              <Input
              type="number"
              placeholder="Amount"
              name="amount"
              min={0.01}
              max={1000000}
              required
            />
            <Button type="submit">Deposit</Button>

            </div>
            
          </form>
        </CardContent>
      </Card>
    </>
  );
}
