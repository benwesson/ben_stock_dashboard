import styles from '@/components/positions/positions.module.css';
import Link from 'next/link';
import { findStocks } from '@/api/prisma_api'; // Fixed import path - added /app
import { fetchMultipleStocks } from '@/api/stock_api'; // Fixed import path - added /app

export default async function Positions() {
  let response;
  let stockPricesData = {};
  let chartArray=[];
  
  try {
    response = await findStocks(); 
    
    if (response && response.length > 0) {
      const tickers = response.map(stock => stock.ticker);
      console.log('Fetching detailed data for tickers:', tickers);
      
      try {
        const multipleStockResponse = await fetchMultipleStocks(tickers);
        
        console.log(`Successfully fetched ${multipleStockResponse.successCount} stocks`);
        
        if (multipleStockResponse.errorCount > 0) {
          console.warn(`Failed to fetch ${multipleStockResponse.errorCount} stocks:`, 
                      multipleStockResponse.errors);
        }
        
        // Ensure we have valid data
        stockPricesData = multipleStockResponse.data || {};
        
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    }
    
  } catch (error) {
    console.error('Error fetching stocks from database:', error);
    return (
      <div>
        <h2>Positions</h2>
        <p>Error loading stock positions.</p>
      </div>
    );
  }

  // Add safety check for response
  if (!response || response.length === 0) {
    return (
      <div>
        <h2>Positions</h2>
        <p>No stock positions found.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Positions</h2>
      {response.map((stock) => {
        // Use ticker as key to access the stock data
        const stockData = stockPricesData[stock.ticker];
        
        // Get the latest price (first item in the data array)
        const latestPrice = stockData?.data?.[0]?.close 
        
        // Get other data if available
        const dataPoints = stockData?.data?.length || 0;
        const latestOpen = stockData?.data?.[0]?.open;
        const latestHigh = stockData?.data?.[0]?.high;
        const latestLow = stockData?.data?.[0]?.low;
        
        return (
          <div key={stock.ticker}>
            <h3>{stock.ticker}</h3>
            <p>Latest Price: ${latestPrice.toFixed(2)}</p>
            <p>Shares: {stock.quantity}</p>
            <p>Total Value: ${(latestPrice * stock.quantity).toFixed(2)}</p>
            {/* <p>Data Points: {dataPoints}</p> */}
            
            {/* Show additional data if available */}
            {stockData?.data?.[0] && (
              <div>
                <p>Open: ${latestOpen?.toFixed(2)}</p>
                <p>High: ${latestHigh?.toFixed(2)}</p>
                <p>Low: ${latestLow?.toFixed(2)}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}