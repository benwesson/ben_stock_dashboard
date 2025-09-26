"use server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import {
  findTicker,
  getFunds,
  getQuantitiesByTicker,
  updateStock,
} from "@/actions/prisma_api";

export async function populateSelectOptions() {
  function validateSellInput(
    ticker: FormDataEntryValue | null,
    sharesToSell: FormDataEntryValue | null
  ) {
    try {
      validationSchema.parse({ ticker, sharesToSell });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation Errors:", error.issues);
      }
      return false;
    }
  }
  //Define Zod schema for validation
  const validationSchema = z.object({
    ticker: z
      .string()
      .regex(/^[A-Za-z]+$/, "Input must be alphabetic")
      .min(1, "Ticker is required"),

    sharesToSell: z
      .number("The shares to sell must be a number")
      .min(1, "You must sell at least 1 share")
      .max(100, "You can only sell 100 shares at a time"),
  });

  //Get user email to see who is logged in
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    throw new Error("User not authenticated");
  }

  const promises = [
    findStocks(email),
    findDistinctTickers(email),
    getFunds(email),
  ];
  const [stocks, distinctTickers, funds] = await Promise.all(promises);

  if (!stocks) {
    console.error("No stocks found for user:", email);
  }
}
