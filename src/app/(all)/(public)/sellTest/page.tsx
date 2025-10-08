import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import SellComponent from "@/components/sellPage/SellComponent";
import { fetchMultipleStocks } from "@/actions/stock_api";
import { findStocks } from "@/actions/prisma_api";

export default async function SellTest() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <div>Please sign in to sell stocks.</div>;
  }

  const stockData = await findStocks(email);
  if (stockData.length === 0) {
    return <div>You do not own any stocks to sell.</div>;
  }

  const stockList = Array.from(
    new Set(stockData.map((s) => s.ticker.toUpperCase()))
  );

  const priceResp = await fetchMultipleStocks(stockList,1);
  if (!priceResp || !priceResp.data) {
    return <div>Error fetching stock prices.</div>;
  }

  const latestPrices: Record<string, number> = {};
  for (const t of stockList) {
    latestPrices[t] = priceResp.data[t]?.data?.[0]?.close ?? 0;
  }

  const enrichedStockData = stockData.map((s) => {
    const currentPrice = latestPrices[s.ticker.toUpperCase()] ?? 0;
    return {
      id: s.id, // keep id for stable keys
      ticker: s.ticker,
      quantity: s.quantity,
      boughtAt: s.price, // original purchase price
      currentPrice,
      summary: `Ticker: ${s.ticker}, Quantity: ${s.quantity}, Bought At: ${s.price}, Current Price: ${currentPrice}`,
    };
  });

  console.log("Enriched:", enrichedStockData);

  return (
    <div>
      <SellComponent stockData={enrichedStockData}  />
    </div>
  );
}
