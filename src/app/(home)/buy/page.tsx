import BuyForm from "@/components/buyForm/buyForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


export default async function TradePage() {

  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (email) {
    return <BuyForm email={email} />;
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}
