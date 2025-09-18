"use server";
import { z } from "zod";
import { fetchStock } from "@/actions/stock_api";
import { findTicker, findDistinctTickers } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


export async function handleSearch(formData: FormData) {
  //Get user email to see who is logged in 
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    throw new Error("User not authenticated");
  }

  //Get ticker from input in form
  const formTicker = formData.get("ticker");

  //Define Zod schema for search
  const searchSchema = z.object({
    ticker: z.string().regex(/^[A-Za-z]+$/, "Input must be alphabetic").min(1, "Ticker is required")
  });

  function validateTicker(ticker: unknown) {
    try {
      searchSchema.parse({ ticker });
      return String(ticker).toUpperCase();
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log("Validation Errors:", error.issues);
      }
      return false;
    }
  }

  async function validateFetch(ticker: string) {
    try {
      const stock = await fetchStock(ticker);
      const stockData = stock?.data?.[0];
      if (!stockData) {
        console.log("No stock data found for ticker:", ticker);
        return null;
      }
      return stockData;
    } catch (error) {
      console.log("Fetch error:", error);
      return null;
    }
  }
  
  //Make sure ticker is a valid string
  const isValidTicker = validateTicker(formTicker);

  //If ticker is valid continue
  if (isValidTicker !== false) {
    //Fetch stock from marketstack
    const stock = await validateFetch(isValidTicker);
    const stockPrice = stock?.close;
    if (!stock) {
      console.log("Stock not found for ticker:", isValidTicker);
      return;
    }
    

    //Fetch details about ticker from database
    const existingTicker = await findTicker(isValidTicker, email);
    const buyOrders = existingTicker.length;
    //Calculate the total shares owned if any buy summing up to 3 orders worth of shares
    const totalSharesOwned =
      (existingTicker[0]?.quantity ?? 0) +
      (existingTicker[1]?.quantity ?? 0) +
      (existingTicker[2]?.quantity ?? 0);

    //Fetch distinct tickers to check how many different stocks user owns
    const distinctTickers = await findDistinctTickers(email);
    //
    //Define Zod schema for validation
    const validationSchema = z.object({
      ticker: z.string().min(1, "Ticker is required"),
      stockPrice: z.number().min(0.01, "Stock price must be at least 0.01"),
      totalSharesOwned: z.number("The total shares owned must be a number"),
      accountStocks: z.number().max(4, "You can only own 4 different stocks"),
      buyOrders: z.number().max(3, "Quantity must be at most 3"),
    });

    //Package results from databse and form into object for validation
    const dataToValidate = {
      ticker: isValidTicker,
      stockPrice: stockPrice,
      totalSharesOwned: totalSharesOwned,
      accountStocks: distinctTickers.length,
      buyOrders: buyOrders,
    };

    try {
      const validatedInput = validationSchema.safeParse(dataToValidate);
      console.log("Validated Input:", validatedInput);

      return validatedInput.success ? [validatedInput.data] : [];
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error);
        return error.issues;
      }
    }
  }
}


