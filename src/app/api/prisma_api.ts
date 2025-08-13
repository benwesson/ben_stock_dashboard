"use server"
import { prisma } from "@/utils/prisma";

export async function createStock(ticker: string, quantity: number, price: number) {
    await prisma.stock.create({
        data: {
            ticker: ticker,
            quantity: quantity,
            price: price,
            
        }
    })
}

export async function findTicker(ticker:string){
    const exists = await prisma.stock.findUnique({
        where: {
            ticker: ticker,
        },
        select:{
            ticker: true,
            quantity: true,
            price: true,
        }
    })
    return exists;
}

export async function updateStock(ticker:string, quantity: number, price:number) {
    await prisma.stock.update({
        where: {
            ticker: ticker,
        },
        data: {
            quantity:quantity,
            price:price
        }

    })
}

export async function findStocks(){
    const stocks = await prisma.stock.findMany({
        select:{
            ticker:true,
            quantity:true,
            price:true,
           
        }
    })
    return stocks;
}

export async function deleteStock(ticker:string){
    await prisma.stock.delete({
        where: {
            ticker:ticker,
        }
        
        
    })
}