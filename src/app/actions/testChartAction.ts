import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { fetchStock } from "@/actions/stock_api";
import { findDistinctTickers } from "@/actions/prisma_api";

type chartConfigType = {
  price: { label: string };
  [key: string]: { label: string; color?: string };
};
type chartRow = { date: string; stock1: number; stock2?: number; stock3: number; stock4?: number };
type chartDataType = chartRow[];

function createChartConfig(stockData: { ticker: string }[]) {
  const palette = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
    "var(--chart-5)",
  ];
  const chartConfig: chartConfigType = {
    price: { label: "Price USD" },
  };
  for (const stock of stockData) {
    chartConfig[stock.ticker] = { label: stock.ticker, color: palette.shift()  };
  }
  console.log("Created chart config:", chartConfig);
  return {
    config: chartConfig,
  }
  
}

function createChartData(stockData: { ticker: string }[], responses: Awaited<ReturnType<typeof fetchStock>>[]) {

  const chartData: chartDataType = [];
  for (const response of  responses) {
    const rows = response.data.map((item: { date: string; close: number; }) => ({
      date: item.date.split("T")[0],
      [stockData[responses.indexOf(response)].ticker]: item.close,
      
    }));
    chartData.push(...rows);
  }
  
  return chartData;
}

export  async function testChartAction() {
   //Get email from session
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
	return { success: false, message: "No email found" };
  }

  //Find out what stocks the user has
  const stockData = await findDistinctTickers(email);
  console.log("User stock data:", stockData);
  if (stockData.length === 0) {
	return { success: false, message: "No stocks found" };
  }
  const testArray = []
  const promises  = [];
  for (const stock of stockData) {
    promises.push(fetchStock(stock.ticker, 100));
  }

  const chartConfig = createChartConfig(stockData);
  console.log("Chart Config:", chartConfig);

  const responses = await Promise.all(promises);
  console.log("Fetch Responses:", responses);

  const chartData = createChartData(stockData,responses);
  console.log("Chart Data:", chartData[299]);
  
  return {
    success: true,
    config: chartConfig,
    data: chartData,
  };
  
 
}