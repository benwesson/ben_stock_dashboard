"use server";
import { z } from "zod";
import { fetchStock } from "@/actions/stock_api";
import { findTicker, findDistinctTickers,  } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

//Define Zod schema for validation
const validationSchema = z.object({
  ticker: z
    .string()
    .regex(/^[A-Za-z]+$/, "Input must be alphabetic")
    .min(1, "Ticker is required"),
  stockPrice: z
    .number()
    .min(0.01, "Stock price must be at least 0.01")
    .optional(),
  totalSharesOwned: z
    .number("The total shares owned must be a number")
    .optional(),
  accountStocks: z
    .number()
   
    .optional(),
  buyOrders: z.number().max(3, "Quantity must be at most 3").optional(),
});

export type SearchProps = z.infer<typeof validationSchema>;

export interface SearchActionState extends SearchProps {
  errors?: {
    ticker?: string[];
    stockPrice?: string[];
    totalSharesOwned?: string[];
    accountStocks?: string[];
    buyOrders?: string[];
  };
}

function validateTicker(ticker: FormDataEntryValue | null) {
  try {
    validationSchema.parse({ ticker });

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Errors:", error.issues);
    }

    return false;
  }
}

async function validateFetch(ticker: string) {
  try {
    const stock = await fetchStock(ticker, 1);
    const stockData = stock?.data?.[0];

    if (!stockData) {
      console.error("No stock data found for ticker:", ticker);

      return false;
    }

    return stockData;
  } catch (error) {
    console.error("Fetch error:", error);

    return false;
  }
}

export async function handleSearch(
  _prevState: SearchProps,
  formData: FormData
): Promise<SearchActionState> {
  //Get user email to see who is logged in
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    return {
      ticker: "",
      errors: { ticker: ["User email not found in session"] },
    };
  }

  //Get ticker from input in form
  const formTicker = formData.get("ticker");

  //Make sure ticker is a valid string
  const isValidTicker = validateTicker(formTicker);

  //If ticker is valid continue
  if (isValidTicker) {
    //Fetch stock from marketstack
    const _ticker = formTicker!.toString().toUpperCase();

    const promises = [validateFetch(_ticker), findTicker(_ticker, email), findDistinctTickers(email)];
    const [stock, existingTicker, distinctTickers] = await Promise.all(promises);

    const stockPrice = stock?.close;

    if (!stock) {
      console.log("Stock not found for ticker:", _ticker);

      return {
        ticker: _ticker,
        errors: { ticker: ["Stock not found for ticker"] },
      };
    }

    const buyOrders = existingTicker.length;
    //Calculate the total shares owned if any buy summing up to 3 orders worth of shares
    const totalSharesOwned =
      (existingTicker[0]?.quantity ?? 0) +
      (existingTicker[1]?.quantity ?? 0) +
      (existingTicker[2]?.quantity ?? 0);

    //Package results from databse and form into object for validation
    return {
      ticker: _ticker,
      stockPrice: stockPrice,
      totalSharesOwned: totalSharesOwned,
      accountStocks: distinctTickers.length,
      buyOrders: buyOrders,
    };
  }

  return {
    ticker: formTicker ? formTicker.toString().toUpperCase() : "",
    errors: { ticker: ["Invalid ticker input"] },
  };
}
