import axios from "axios";

export default async function fetchAlphaVantageData() {
const url = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=VOO&interval=5min&apikey=${process.env.ALPHA_VANTAGE_API_KEY}`;
  try {
    const response = await axios.get(url);
    console.log("Response from Alpha Vantage API:", response.data);
    return response.data;
    
  } catch (error) {
    console.error("Error fetching Alpha Vantage data:", error);
    throw error;
  }
}