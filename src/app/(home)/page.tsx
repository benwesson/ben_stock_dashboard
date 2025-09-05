import Positions from "@/components/positions/positions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import { findStocks, findDistinctTickers } from "@/api/prisma_api";
import { fetchMultipleStocks } from "@/api/stock_api";
import PortfolioChart from "@/components/portfolioChart/portfolioChart"
import {getTranslations} from 'next-intl/server';
// {params,}:{params} Promise<{ lang: string }>
export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    return <div>Please sign in to buy stocks.</div>;
  }

  const funds = await getFunds(email);
  const stocks = (await findStocks(email).catch(() => [])) || [];

  // Build a distinct, uppercased ticker list from findDistinctTickers
  const distinctTickersRaw = (await findDistinctTickers(email).catch(() => [])) || [];
  const tickers = Array.from(
    new Set(
      distinctTickersRaw
        .map((t: any) => (typeof t === "string" ? t : t?.ticker))
        .filter(Boolean)
        .map((t: string) => t.toUpperCase())
    )
  );

  // Fetch prices once for distinct tickers (lower chance of 429)
  const priceResponse = tickers.length
    ? await fetchMultipleStocks(tickers, { limit: 4 })
    : { data: {} as Record<string, any> };

  const stockPrices = priceResponse?.data || {};

  return (
    <>
     
      <ShowFunds funds={funds} email={email} />
      <PortfolioChart stocks={stocks} stockPrices={stockPrices} />
      <Positions stocks={stocks} stockPrices={stockPrices} />
    </>
  );
}





