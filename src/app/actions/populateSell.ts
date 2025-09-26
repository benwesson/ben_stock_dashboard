""
import { findStocks } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function PopulateSell() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const stocks = await findStocks(email);
  return stocks;
}
