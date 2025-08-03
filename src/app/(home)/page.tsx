import Image from "next/image";
import styles from "./home.module.css";
import fetchAlphaVantageData from "@/api/api"
import Positions from "@/components/positions/positions";
export default async function Home() {
  let alphaVantageData = null;
  let errorMessage = null;

  // try {
  //   alphaVantageData = await fetchAlphaVantageData();
  // } catch (error) {
  //   console.error("Failed to fetch Alpha Vantage data:", error);
  //   errorMessage = "Failed to load stock data. Please check your API configuration.";
  // }

  // Extract the latest stock price if data is available
  const getLatestPrice = (data: any) => {
    if (!data || !data['Time Series (5min)']) return null;
    
    const timeSeries = data['Time Series (5min)'];
    const latestTime = Object.keys(timeSeries)[0]; // Most recent timestamp
    const latestData = timeSeries[latestTime]; 
    
    return {
      time: latestTime,
      price: latestData['4. close'],
      symbol: data['Meta Data']['2. Symbol']
    };
  };

  const latestPrice = getLatestPrice(alphaVantageData);

  return (
    <>
      <div className={styles.navbar}>Navbar</div>
      <div className={styles.container}>
        <div className={styles.value}>
          {errorMessage ? (
            <div style={{ color: 'red', padding: '1rem' }}>
              {errorMessage}
            </div>
          ) : latestPrice ? (
            <div>
              <h2>Stock Price: {latestPrice.symbol}</h2>
              <p>Current Price: ${latestPrice.price}</p>
              <p>Last Updated: {latestPrice.time}</p>
            </div>
          ) : (
            <p>Loading stock data...</p>
          )}
        </div>
        <div ><Positions /> </div>
        <div className={styles.footer}>Footer</div>
      </div>
    </>
  );
}
