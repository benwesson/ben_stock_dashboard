import { findStocks } from "@/api/prisma_api";
import SellForm from "./sellingForm";

export default async function Sell() {
  const stocks = (await findStocks().catch(() => [])) || [];
  return <SellForm stocks={stocks} />;
}



