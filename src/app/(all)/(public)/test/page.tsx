"use client";
import { useActionState } from "react";

import { handleSearch } from "@/actions/formValidation";

import type { SearchActionState } from "@/actions/formValidation";

const initialFormState: SearchActionState = {
  ticker: "",
};

export default function TestPage() {
  const [state, formAction, pending] = useActionState(
    handleSearch,
    initialFormState
  );

  return (
    <>
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
          </>
        )
      )}
    </>
  );
}
