import axios from "axios";

export default async function fetchStock(stockTicker) {
    const options = {
        method: "GET",
        url: `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}`,
        params: {
            symbols: stockTicker,
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
