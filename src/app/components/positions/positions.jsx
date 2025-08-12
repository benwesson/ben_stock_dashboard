import styles from '@/components/positions/positions.module.css';
import Link from 'next/link';
import { findStocks } from '@/api/prisma_api';
import { fetchMultipleStocks } from '@/api/stock_api';
import PortfolioChart from '@/components/portfolioChart/portfolioChart';

export default async function Positions() {
  let response;
  let stockPricesData = {};
  let chartData = {};
  let stockQuantities = {}; // Store quantities for chart calculation
  
  try {
    response = await findStocks(); 
    
    if (response && response.length > 0) {
      const tickers = response.map(stock => stock.ticker);
      console.log('Fetching detailed data for tickers:', tickers);
      
      // Create quantities object for chart calculation
      response.forEach(stock => {
        stockQuantities[stock.ticker] = stock.quantity;
      });
      
      try {
        const multipleStockResponse = await fetchMultipleStocks(tickers);
        stockPricesData = multipleStockResponse.data || {};
        
        // Process each ticker to extract closing prices
        for (const ticker of tickers) {
          const stockData = stockPricesData[ticker];
          
          if (stockData?.data && Array.isArray(stockData.data)) {
            chartData[ticker] = stockData.data
              .slice()
              .reverse() // Oldest to newest
              .map(dataPoint => dataPoint.close);
            
            console.log(`${ticker}: ${chartData[ticker].length} closing prices extracted`);
          } else {
            chartData[ticker] = [];
            console.warn(`No data available for ${ticker}`);
          }
        }
        
        console.log('Final chartData object:', chartData);
        console.log('Stock quantities:', stockQuantities);
        
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

  if (!response || response.length === 0) {
    return (
      <div>
        <h2>Positions</h2>
        <p>No stock positions found.</p>
      </div>
    );
  }

  // Calculate current total portfolio value
  const currentTotalValue = response.reduce((total, stock) => {
    const latestPrice = stockPricesData[stock.ticker]?.data?.[0]?.close || stock.price || 0;
    return total + (latestPrice * stock.quantity);
  }, 0);

  return (
    <div>
      <h2>Positions</h2>
      
      {/* Portfolio Summary */}
      <div style={{ 
        marginBottom: '30px', 
        padding: '20px', 
        backgroundColor: '#f5f5f5', 
        borderRadius: '8px' 
      }}>
        <h3>Portfolio Summary</h3>
        <p>Total Stocks: {response.length}</p>
        <p>Current Portfolio Value: <strong>${currentTotalValue.toFixed(2)}</strong></p>
      </div>

      {/* Portfolio Chart */}
      {Object.keys(chartData).length > 0 && (
        <div style={{ 
          marginBottom: '30px', 
          padding: '20px', 
          backgroundColor: 'white', 
          borderRadius: '8px',
          border: '1px solid #ddd'
        }}>
          <PortfolioChart chartData={chartData} stockQuantities={stockQuantities} />
        </div>
      )}

      {/* Individual Stock Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {response.map((stock) => {
          const stockData = stockPricesData[stock.ticker] || {};
          const latestPrice = stockData?.data?.[0]?.close || stock.price || 0;
          const dataPoints = stockData?.data?.length || 0;
          const latestOpen = stockData?.data?.[0]?.open;
          const latestHigh = stockData?.data?.[0]?.high;
          const latestLow = stockData?.data?.[0]?.low;
          
          // Calculate day change
          const dayChange = latestOpen ? ((latestPrice - latestOpen) / latestOpen * 100) : 0;
          
          return (
            <div key={stock.ticker} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '15px',
              backgroundColor: 'white'
            }}>
              <h3>{stock.ticker}</h3>
              <p style={{ 
                fontSize: '20px', 
                fontWeight: 'bold', 
                color: dayChange >= 0 ? 'green' : 'red' 
              }}>
                ${latestPrice.toFixed(2)}
                <span style={{ fontSize: '14px', marginLeft: '10px' }}>
                  {dayChange >= 0 ? '+' : ''}{dayChange.toFixed(2)}%
                </span>
              </p>
              <p>Shares: <strong>{stock.quantity}</strong></p>
              <p>Total Value: <strong>${(latestPrice * stock.quantity).toFixed(2)}</strong></p>
              
              {stockData?.data?.[0] && (
                <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                  <p>Open: ${latestOpen?.toFixed(2)} | High: ${latestHigh?.toFixed(2)} | Low: ${latestLow?.toFixed(2)}</p>
                  <p>Data Points: {dataPoints}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}