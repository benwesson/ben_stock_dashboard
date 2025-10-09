"use client";
import { useActionState, useState, useEffect } from "react";
import { ServerActionTest, BuyActionState } from "@/actions/buy/buyAction";
import  { SearchActionState, handleSearch } from "@/actions/buy/searchValidation";

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

const initialBuyState: BuyActionState = {
  quantity: "0",
  ticker: "",
};


export default function BuyComponent() {
  const [state, formAction, pending] = useActionState(handleSearch, initialFormState);
  const [buyState, buyAction, buyPending] = useActionState(ServerActionTest, initialBuyState);
  const [buySubmitted, setBuySubmitted] = useState(false);

  // reset submission flag when the searched ticker changes
  useEffect(() => setBuySubmitted(false), [state.ticker]);

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
              <form action={buyAction} onSubmit={() => setBuySubmitted(true)}>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  min="1"
                  max="100"
                  required
                />
                <input type="hidden" name="ticker" value={state.ticker} /> 
                <button type="submit">Buy</button>
              </form>

              {buyPending ? (
                <div>Processing purchase...</div>
              ) : buySubmitted ? (
                buyState.errors ? (
                  <div style={{ color: "red" }}>
                    {Object.values(buyState.errors).map((error, index) => (
                      <div key={index}>{error}</div>
                    ))}
                  </div>
                ) : (
                  <div>Purchase successful!</div>
                )
              ) : null}
            </>
          )
        )}
      </CardContent>
    </Card>
  );
}