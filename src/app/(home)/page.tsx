import Positions from "@/components/positions/positions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import { findStocks } from "@/api/prisma_api";
import {  fetchMultipleStocks } from "@/api/stock_api";
import PortfolioChart, { makePortfolioChartData } from "@/components/portfolioChart/portfolioChart"
export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  
  if (email) {
    const funds = await getFunds(email);
    const stocks = (await findStocks(email).catch(() => [])) || [];
    console.log("Stocks in TradePage:", stocks);
    const priceResponse = await fetchMultipleStocks(stocks.map((stock) => stock.ticker));
    const stockPrices = priceResponse.data;

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <PortfolioChart stocks={stocks} stockPrices={stockPrices}  />
        <Positions stocks={stocks} stockPrices={stockPrices} />
      </>
    

    )
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}





