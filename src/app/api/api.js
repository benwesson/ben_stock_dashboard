import axios from "axios";

export default async function fetchStock() {
    const options = {
        method: "GET",
        url: `https://api.marketstack.com/v1/eod?access_key=${process.env.NEXT_PUBLIC_MARKETSTACK_API_KEY}`,
        params: {
            symbols: "AAPL",
        },
    };

    try {
        const response = await axios.request(options);
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
}
