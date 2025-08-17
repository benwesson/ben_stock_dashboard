"use server";

import { prisma } from "@/utils/prisma";

export async function createStock(ticker: string, quantity: number, price: number) {
  await prisma.stock.create({
    data: { ticker: ticker.toUpperCase(), quantity, price },
  });
}

export async function findTicker(ticker: string) {
  return prisma.stock.findFirst({
    where: { ticker: ticker.toUpperCase() },
    select: { ticker: true, quantity: true, price: true, id: true },
  });
}

export async function updateStock(ticker: string, quantity: number, price: number) {
  // updates all rows with this ticker
  await prisma.stock.updateMany({
    where: { ticker: ticker.toUpperCase() },
    data: { quantity, price },
  });
}

export async function findStocks() {
  return prisma.stock.findMany({
    select: { ticker: true, quantity: true, price: true, id: true },
    orderBy: { purchaseTime: "desc" },
  });
}

export async function sellStock(ticker: string, quantity: number) {
  await prisma.stock.updateMany({
    where: { ticker: ticker.toUpperCase() },
    data: { quantity },
  });
}

export async function deleteStock(ticker: string) {
  await prisma.stock.deleteMany({
    where: { ticker: ticker.toUpperCase() },
  });
}