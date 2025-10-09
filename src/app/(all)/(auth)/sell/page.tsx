import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import SellComponent from "@/components/sellPage/SellComponent";
import { fetchStock } from "@/actions/stock_api";
import { findStocks } from "@/actions/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";


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
  
  // Map of TICKER -> latest close
  const priceMap: Record<string, number> = {};

  const promises: Promise<any>[] = [];
  for (const ticker of stockList) {
    promises.push(fetchStock(ticker, 1));
  }

  const stockInfoResponses = await Promise.all(promises);
  stockInfoResponses.forEach((stockInfo, index) => {
    const ticker = stockList[index];
    const close = stockInfo?.data?.[0]?.close ?? 0;
    priceMap[ticker] = close;
  });

  console.log("Price Map:", priceMap);

  const enrichedStockData = stockData.map((s) => {
    const t = s.ticker.toUpperCase();
    const currentPrice = priceMap[t] ?? 0;
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
    <>
      <ShowFunds />
      <SellComponent stockData={enrichedStockData}  />
    </>
  );
}

