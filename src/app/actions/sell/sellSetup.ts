import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { fetchMultiTest } from "@/actions/stock_api";
import { findStocks } from "@/actions/prisma_api";

export type SellData = {
  id: number;
  ticker: string;
  quantity: number;
  boughtAt: number;
  currentPrice: number;
}
export default async function sellSetup() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) { throw new Error("No user email found"); }

  const stockData = await findStocks(email);
  if (!stockData) {
    throw new Error("No stocks found for user");
  }

  const stockList = Array.from(
    new Set(stockData.map((s) => s.ticker.toUpperCase()))
  );

  const priceResp = await fetchMultiTest(stockList,1);
  
  return { session, stockData, priceResp  };
  
}