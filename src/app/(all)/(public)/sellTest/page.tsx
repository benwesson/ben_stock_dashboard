import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import SellComponent from '@/components/sellPage/SellComponent';
import {fetchMultipleStocks} from '@/actions/stock_api';
import { findDistinctTickers, findStocks } from '@/actions/prisma_api';

export default async function SellTest() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return <div>Please sign in to sell stocks.</div>;
  }
  
  // const distinctTickers = await findDistinctTickers(email);
  const stockData = await findStocks(email);
  if (stockData.length === 0) {
    return <div>You do not own any stocks to sell.</div>;
  }
  

  return (
    <div>

        <SellComponent stockData = {stockData} />

    </div>
  );
}
