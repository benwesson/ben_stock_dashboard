import { fetchStock } from "@/actions/marketStack/stock_api";
export default async function validateFetch(ticker: string) {
  try {
    const stock = await fetchStock(ticker, 1);
    const stockData = stock?.data?.[0];

    if (!stockData) {
      console.error("No stock data found for ticker:", ticker);

      return false;
    }

    return stockData;
  } catch (error) {
    console.error("Fetch error:", error);

    return false;
  }
}