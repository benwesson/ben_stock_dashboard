import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { fetchStock } from "@/actions/stock_api";
import { findStocks } from "@/actions/prisma_api";

export type ChartDataType =
  | {
      success: true;
      data: Record<string, { dates: string[]; closes: number[] }>;

    }
  | { success: false; message: string };
export  async function ChartAction() {
   //Get email from session
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return { success: false, message: "No email found" };
  }

  //Find out what stocks the user has
  const stockData = await findStocks(email);
  if (stockData.length === 0) {
    return { success: false, message: "No stocks found" };
  }

  //Get unique list of stocks
  const stockList = Array.from(
    new Set(stockData.map((s) => s.ticker.toUpperCase()))
  );
  
  
  //Fetch price data for each stock for last 100 days
  const promises: Promise<any>[] = [];
  for (const ticker of stockList) {
    promises.push(fetchStock(ticker, 100));
  }

  const Responses = await Promise.all(promises);

  // TICKER -> { dates: string[], closes: number[] }
  const seriesByTicker: Record<string, { dates: string[]; closes: number[] }> = {};

  stockList.forEach((ticker, i) => {
    const res = Responses[i];
    const rows: { date: string; close: number }[] = res?.data ?? [];
    // Ensure chronological order (oldest -> newest)
    rows.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    seriesByTicker[ticker] = {
      dates: rows.map((r) => r.date.split("T")[0]),
      closes: rows.map((r) => Number(r.close ?? 0)),
    };
  });

    console.log("Series by Ticker:", seriesByTicker);
  return { success: true, data: seriesByTicker };
  

 


  
  
}