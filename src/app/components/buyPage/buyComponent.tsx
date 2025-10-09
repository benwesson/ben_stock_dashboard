"use client";
import { useActionState } from "react";
import ServerActionTest from "@/actions/buy/buyAction";
import  { SearchActionState, handleSearch } from "@/actions/buy/formValidation";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const initialFormState: SearchActionState = {
  ticker: "",
};

// const initialBuyState = {
//   quantity: 0,
//   ticker: "",
// };

export default function BuyComponent() {
  const [state, formAction, pending] = useActionState(
    handleSearch,
    initialFormState
  );

  return (
    <Card className="mt-8">
      <CardContent>
        <form action={formAction}>
          <input type="text" name="ticker" placeholder="Ticker" required />
          <button type="submit">Search</button>
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
          state.ticker && (
            <>
              
              <div>Ticker: {state.ticker}</div>
              <div>Stock Price: {state.stockPrice}</div>
              <div>Total Shares Owned: {state.totalSharesOwned}</div>
              <div>Account Stocks: {state.accountStocks}</div>
              <div>Buy Orders: {state.buyOrders}</div>
              <form action={ServerActionTest}>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  required
                />
                <input type="hidden" name="ticker" value={state.ticker} /> 
                <button type="submit">Buy</button>
              </form>
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}