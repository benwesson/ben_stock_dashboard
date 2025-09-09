"use server";
import { z } from "zod";
import { fetchStock } from "@/actions/stock_api";
import { findTicker,findDistinctTickers } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


export async function handleSearch(formData: FormData) {
  // // const formData = new FormData(event.currentTarget);
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
     throw new Error("User not authenticated");
   }

  
  //Get ticker from input in form
  // const formData = new FormData(event.currentTarget);
  let formTicker = formData.get("ticker") as string;
  if(formTicker === null){
     return { error: "Ticker is required" };
  } else {
    formTicker.toUpperCase();
  }

  //Fetch stock from marketstack
  const stock = await fetchStock(formTicker)

  //Fetch details about ticker from database
  const existingTicker = await findTicker(formTicker, email);
  const buyOrders = existingTicker.length;
  //Calculate the total shares owned if any buy summing up to 3 orders worth of shares
  const totalSharesOwned = (existingTicker[0]?.quantity ?? 0) + (existingTicker[1]?.quantity ?? 0) + (existingTicker[2]?.quantity ?? 0);

  //Fetch distinct tickers to check how many different stocks user owns
  const distinctTickers = await findDistinctTickers(email);

  //Define Zod schema for validation
  const SearchSchema = z.object({
    ticker: z.string().min(1, "Ticker is required"),
    stockPrice: z.number().min(0.01, "Stock price must be at least 0.01"),
    totalSharesOwned: z.number("The total shares owned must be a number"),
    accountStocks: z.number().max(4, "You can only own 4 different stocks"),
    buyOrders: z.number().max(3, "Quantity must be at most 3"),
  });

  //Package results from databse and form into object for validation
  const dataToValidate = {
    ticker: formTicker,
    stockPrice: stock.data[0].close,
    totalSharesOwned: totalSharesOwned,
    accountStocks: distinctTickers.length,
    buyOrders: buyOrders,
  }
  try {
    const validatedInput = SearchSchema.safeParse(dataToValidate);
    console.log("Validated Input:", validatedInput);
    return validatedInput;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return error.issues;
      
    }
  }
}


