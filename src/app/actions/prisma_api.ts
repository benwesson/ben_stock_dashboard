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
  ticker: string,
  quantity: number,
  userEmail: string
) {
  // updates all rows with this ticker
  await prisma.stock.updateMany({
    where: { ticker: ticker.toUpperCase(), userEmail: userEmail },
    data: { quantity, userEmail },
  });
}

export async function findStocks(userEmail: string) {
  return prisma.stock.findMany({
    where: { userEmail: userEmail },
    select: { ticker: true, quantity: true, price: true, id: true },
    orderBy: { purchaseTime: "desc" },
  });
}

export async function deleteStock(ticker: string, userEmail: string) {
  await prisma.stock.deleteMany({
    where: { ticker: ticker.toUpperCase(), userEmail: userEmail },
  });
}

export async function addFunds(email: string, funds: number) {
  await prisma.user.update({
    where: { email: email },
    data: { funds },
  });
}

export async function getFunds(email?: string) {
  const session = await getServerSession(authOptions);

  const _email = session?.user?.email || email;

  if (!_email) {
    throw new Error("User not authenticated");
  }

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

export async function getQuantitiesByTicker() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  const rows = await prisma.stock.groupBy({
    by: ["ticker"],
    where: { userEmail: email },
    _sum: { quantity: true },
  });
  return rows.map((r) => ({
    ticker: r.ticker.toUpperCase(),
    quantity: r._sum.quantity ?? 0,
  }));
}

export async function getTotalSharesForTicker(ticker: string, userEmail: string) {
  const agg = await prisma.stock.aggregate({
    where: { userEmail, ticker: ticker.toUpperCase() },
    _sum: { quantity: true },
  });
  return agg._sum.quantity ?? 0;
}
