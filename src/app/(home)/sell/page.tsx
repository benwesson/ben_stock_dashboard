import SellForm from "@/components/sellForm/sellForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import { findStocks } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import {  fetchMultipleStocks } from "@/api/stock_api";

export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  
  if (email) {
    const stocks = (await findStocks(email).catch(() => [])) || [];
    const funds = await getFunds(email);
    const stockPrices = await fetchMultipleStocks(stocks.map((stock) => stock.ticker));
    console.log("Fetched stock prices:", stockPrices);

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <SellForm email={email} stocks={stocks} funds={funds} stockPrices={stockPrices} />
      </>
    

    )
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}