import SellForm from "@/components/sellForm/sellForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import { findStocks,findDistinctTickers } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import { fetchMultipleStocks } from "@/api/stock_api";

// src
// -- app
// ---- (home)
// ------ (auth)
// -------- buy
// -------- sell
// -------- funds
// -------- layout.tsx
// -------- page.tsx
// ---- login
// ------ page.tsx
// ---- layout.tsx

export default async function TradePage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <div>Please sign in to buy stocks.</div>;
  }

  const funds = await getFunds(email);
    const stocks = (await findStocks(email).catch(() => [])) || [];
  
    // Build a distinct, uppercased ticker list from findDistinctTickers
    const distinctTickersRaw = (await findDistinctTickers(email).catch(() => [])) || [];
    const tickers = Array.from(
      new Set(
        distinctTickersRaw
          .map((t: any) => (typeof t === "string" ? t : t?.ticker))
          .filter(Boolean)
          .map((t: string) => t.toUpperCase())
      )
    );
  
    // Fetch prices once for distinct tickers (lower chance of 429)
    const priceResponse = tickers.length
      ? await fetchMultipleStocks(tickers, { limit: 4 })
      : { data: {} as Record<string, any> };
  
    const stockPrices = priceResponse?.data || {};

  // if (email) {
  //   const stocks = (await findStocks(email).catch(() => [])) || [];
  //   const funds = await getFunds(email);
  //   const priceResponse = await fetchMultipleStocks(
  //     stocks.map((stock) => stock.ticker)
  //   );
  //   const stockPrices = priceResponse.data;
  //   console.log("Fetched stock prices:", stockPrices);

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <SellForm
          email={email}
          stocks={stocks}
          funds={funds}
          stockPrices={stockPrices}
        />
      </>
    );
  
}
