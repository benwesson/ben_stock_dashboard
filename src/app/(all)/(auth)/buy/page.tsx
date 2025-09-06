import BuyForm from "@/components/buyForm/buyForm";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";

export default async function TradePage() {
  const funds = await getFunds();

  return (
    <>
      <ShowFunds funds={funds} />
      <BuyForm funds={funds} />
    </>
  );
}
