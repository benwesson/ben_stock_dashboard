import BuyForm from "@/components/buyForm/buyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";


export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  
  if (email) {
    const funds = await getFunds(email);

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <BuyForm email={email} funds={funds} />
      </>
    

    )
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}
