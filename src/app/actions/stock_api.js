import axios from "axios";

// export async function fetchStock(stockTicker) {
//   const options = {
//     method: "GET",
//     url: `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}`,
//     params: {
//       symbols: stockTicker,
//       limit: 100, // Get 100 days of data for this specific stock
//     },
//   };

//   try {
//     const response = await axios.request(options);
//     console.log(`Data for ${stockTicker}:`, response.data);
//     return response.data;
//   } catch (error) {
//     console.error(`Error fetching ${stockTicker}:`, error);
//     throw error;
//   }
// }

export async function fetchMultipleStocks(tickers, limit) {
  const results = {};
  const errors = {};
  let promises = [];

  console.log(`Fetching ${tickers.length} stocks asynchronously...`);

  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    promises.push(fetchStock(ticker, limit));
  }

  try {
    const response = await Promise.all(promises);

    response.forEach((data, index) => {
      const ticker = tickers[index];
      results[ticker] = data;
    });
  } catch (error) {
    console.error(`Failed to fetch ${ticker}:`, error);
    errors[ticker] = error.message;
  }

  return {
    success: Object.keys(results).length > 0,
    data: results,
    errors: errors,
    successCount: Object.keys(results).length,
    errorCount: Object.keys(errors).length,
  };
}

// export async function testCache() {
//   const url =
//     `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}&symbols=AAPL`;
//   const options = {
//     method: "GET",
//     cache: 'force-cache',
//   };
//   try {
//     const response = await fetch(url, options);
//     const result = await response.json();
//     console.log(result);
//   } catch (error) {
//     console.error(error);
//   }
// }




export async function testCache() {
  const stockTicker = "AAPL";
  const url = `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}&symbols=${stockTicker}&limit=100`;
  const options = {
    method: "GET",
    next: { revalidate: 3600 }
  };
    
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
 
}



export async function fetchStock(stockTicker, limit = 100) {
  const url = `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}&symbols=${stockTicker}&limit=${limit}`;
  const options = {
    method: "GET",
    next: { revalidate: 3600 },
    
  };
    
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    console.log(`Data for ${stockTicker}:`, data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
 
}