import { testCache  } from "@/api/stock_api";
export default async function TestPage() {

    const stockData = await testCache();
    console.log("Fetched stock data:", stockData);


  return(
    <div>
      <h1>Marketstack EOD Test</h1>
     <div>{stockData.data[0].close}</div>
    </div>
  )
}