"use server";
import { prisma } from "@/utils/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export async function createStock(
  ticker: string,
  quantity: number,
  price: number,
  userEmail: string
) {
  await prisma.stock.create({
    data: { ticker: ticker.toUpperCase(), quantity, price, userEmail },
  });
}

export async function findTicker(ticker: string, userEmail: string) {
  return prisma.stock.findMany({
    where: { ticker: ticker.toUpperCase(), userEmail: userEmail },
    select: { ticker: true, quantity: true, price: true, id: true },
  });
}

export async function updateStock(
  
  quantity: number,
  userEmail: string,
  id: number
) {
  // updates all rows with this ticker
  await prisma.stock.updateMany({
    where: {  userEmail: userEmail, id: id },
    data: { quantity },
  });
}

export async function findStocks(userEmail: string) {
  return prisma.stock.findMany({
    where: { userEmail: userEmail },
    select: { ticker: true, quantity: true, price: true, id: true },
    orderBy: { purchaseTime: "desc" },
  });
}

export async function deleteStock( userEmail: string, id: number) {
  await prisma.stock.deleteMany({
    where: { userEmail: userEmail, id: id },
  });
}

export async function addFunds(email: string, amount: number) {
  const data =
    amount >= 0
      ? { funds: { increment: amount } }
      : { funds: { decrement: Math.abs(amount) } };
  return prisma.user.update({ where: { email }, data, select: { funds: true } });
}

export async function getFunds(email?: string) {
  const session = await getServerSession(authOptions);

  const _email = session?.user?.email || email;

  const user = await prisma.user.findUnique({
    where: { email: _email },
    select: { funds: true },
  });

  return user?.funds || 0;
}

export async function findDistinctTickers(email: string) {
  return prisma.stock.findMany({
    where: { userEmail: email },
    select: { ticker: true },
    distinct: ["ticker"],
  });
}



export async function getTotalSharesForTicker(ticker: string, userEmail: string) {
  const agg = await prisma.stock.aggregate({
    where: { userEmail, ticker: ticker.toUpperCase() },
    _sum: { quantity: true },
  });
  return agg._sum.quantity ?? 0;
}

export async function findStockOrder (id: number, userEmail: string) {
  return prisma.stock.findFirst({
    where: { id, userEmail },
    select: { ticker: true, quantity: true, price: true, id: true },
  });
}
