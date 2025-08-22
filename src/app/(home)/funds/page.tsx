
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import FundForm from "@/components/fundComponents/fundForm";


export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  
  if (email) {
    const funds = await getFunds(email);

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <FundForm email={email}  />
      </>
    

    )
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}
