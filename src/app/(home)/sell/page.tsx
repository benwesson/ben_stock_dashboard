import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { findStocks } from "@/api/prisma_api";
import SellForm from "@/components/sellForm/sellForm";

export default async function SellPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) return <div>Please sign in to sell stocks.</div>;

  const stocks = (await findStocks(email).catch(() => [])) || [];
  return <SellForm email={email} stocks={stocks} />;
}