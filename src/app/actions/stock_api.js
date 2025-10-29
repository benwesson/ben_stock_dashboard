
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

  
