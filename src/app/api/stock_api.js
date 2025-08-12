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
    
    console.log(`Fetching ${tickers.length} stocks sequentially...`);
    
    for (let i = 0; i < tickers.length; i++) {
        const ticker = tickers[i];
        
        try {
            console.log(`Fetching ${ticker} (${i + 1}/${tickers.length})`);
            
            const stockData = await fetchStock(ticker);
            results[ticker] = stockData;
            
            
            
            // Add a small delay to avoid rate limiting (optional)
            if (i < tickers.length - 1) {
                await new Promise(resolve => setTimeout(resolve, 200)); // 200ms delay
            }
            
        } catch (error) {
            console.error(`Failed to fetch ${ticker}:`, error);
            errors[ticker] = error.message;
        }
    }
    
    return {
        success: Object.keys(results).length > 0,
        data: results,
        errors: errors,
        successCount: Object.keys(results).length,
        errorCount: Object.keys(errors).length
    };
}


