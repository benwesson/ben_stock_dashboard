import FundForm from "@/components/fundComponents/fundForm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import ShowFunds from "@/components/fundComponents/showFunds";

export default async function Funds() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) return <div>Please sign in to sell stocks.</div>;
  return (
    <div>
      <ShowFunds email={email} />
      <FundForm email={email} />
    </div>
  );
}