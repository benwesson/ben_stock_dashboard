import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { findStocks } from "@/api/prisma_api";
import Positions from "@/components/positions/positions";
export default async function Home() {
  type Stock = { ticker: string; quantity: number; price: number };
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  let stocks: Stock[] = [];
  if (email) {
    stocks = await findStocks(email);
  }
  else {
    return <div>Please sign in to view your stocks.</div>;
  }

  return (
    <div>
      {email ? <div>Signed in as {email}</div> : <div>Not signed in</div>}
      <Positions stocks={stocks} />
  
    </div>
  );
}
