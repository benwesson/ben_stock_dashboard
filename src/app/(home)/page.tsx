// import { getServerSession } from "next-auth";
// import { authOptions } from "@/utils/authOptions";
// import { findStocks } from "@/api/prisma_api";
// import Positions from "@/components/positions/positions";
// export default async function Home() {
//   type Stock = { ticker: string; quantity: number; price: number };
//   const session = await getServerSession(authOptions);
//   const email = session?.user?.email;
//   let stocks: Stock[] = [];
//   if (email) {
//     stocks = await findStocks(email);
//   }
//   else {
//     return <div>Please sign in to view your stocks.</div>;
//   }

//   return (
//     <div>
//       {email ? <div>Signed in as {email}</div> : <div>Not signed in</div>}

//       <Positions stocks={stocks} />
  
//     </div>
//   );
// }


import Positions from "@/components/positions/positions";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { getFunds } from "@/api/prisma_api";
import ShowFunds from "@/components/fundComponents/showFunds";
import { findStocks } from "@/api/prisma_api";

export default async function TradePage() {
  
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  
  if (email) {
    const funds = await getFunds(email);
    const stocks = (await findStocks(email).catch(() => [])) || [];

    return (
      <>
        <ShowFunds funds={funds} email={email} />
        <Positions stocks={stocks} />
      </>
    

    )
  }
  else {
    return <div>Please sign in to buy stocks.</div>;
  }

}



