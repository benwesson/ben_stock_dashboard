import axios from "axios";

export async function fetchStock(stockTicker) {
  const options = {
    method: "GET",
    url: `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}`,
    params: {
      symbols: stockTicker,
      limit: 100, // Get 100 days of data for this specific stock
    },
  };

  try {
    const response = await axios.request(options);
    console.log(`Data for ${stockTicker}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${stockTicker}:`, error);
    throw error;
  }
}

export async function fetchMultipleStocks(tickers) {
  const results = {};
  const errors = {};
  let promises = [];

  console.log(`Fetching ${tickers.length} stocks asynchronously...`);

  for (let i = 0; i < tickers.length; i++) {
    const ticker = tickers[i];
    promises.push(fetchStock(ticker));
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
