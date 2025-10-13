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
export  async function testChartAction() {
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

 const chartData =  { success: true, data: {} as Record<string, { dates: string[]; closes: number[] }> }
 console.log(chartData)
 return { chartData }
}