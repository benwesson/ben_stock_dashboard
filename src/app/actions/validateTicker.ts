"use server";
import { z } from "zod";
import { fetchStock } from "@/actions/stock_api";
import { findTicker, findDistinctTickers } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions"; 


export default async function validateTicker(ticker: unknown) {
//Define Zod schema for search
  const searchSchema = z.object({
    ticker: z.string().regex(/^[A-Za-z]+$/, "Input must be alphabetic").min(1, "Ticker is required")
  });
  try {
    searchSchema.safeParse({ ticker });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log("Validation Errors:", error.issues);
    }
    return false;
  }
}