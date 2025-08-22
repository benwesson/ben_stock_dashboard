"use server";

import { prisma } from "@/utils/prisma";

export async function createStock(ticker: string, quantity: number, price: number, userEmail: string) {
  await prisma.stock.create({
    data: { ticker: ticker.toUpperCase(), quantity, price, userEmail },
  });
}

export async function findTicker(ticker: string, userEmail: string) {
  return prisma.stock.findFirst({
    where: { ticker: ticker.toUpperCase(), userEmail: userEmail },
    select: { ticker: true, quantity: true, price: true, id: true },
  });
}

export async function updateStock(ticker: string, quantity: number,  userEmail: string) {
  // updates all rows with this ticker
  await prisma.stock.update({
    where: { ticker: ticker.toUpperCase(), userEmail:userEmail},
    data: { quantity,  userEmail },
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
  await prisma.stock.delete({
    where: { ticker: ticker.toUpperCase(), userEmail: userEmail },
  });
}