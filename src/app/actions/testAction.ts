"use server";
import { z } from "zod";

import { findTicker, findDistinctTickers, createStock } from "@/actions/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import validateFetch from "@/validation/validateFetch";

//Define Zod schema for validation
const validationSchema = z.object({
  ticker: z
    .string()
    .regex(/^[A-Za-z]+$/, "Input must be alphabetic")
    .min(1, "Ticker is required")
    .optional(),
  quantity: z
    .string()
    .regex(/^\d+$/, "Quantity must be a number")
    .min(1, "Quantity is required")
    .optional(),
  accountStocks: z
    .number()
    .max(4, "You can only own 4 different stocks")
    .optional(),
  buyOrders: z.number().max(3, "Quantity must be at most 3").optional(),
});

export type BuyProps = z.infer<typeof validationSchema>;

export interface BuyActionState extends BuyProps {
  errors?: {
    ticker?: string[];
    quantity?: string[];
    accountStocks?: string[];
    buyOrders?: string[];
  };
}

function validateFormData(ticker: string | null, quantity: string | null) {
  try {
    validationSchema.parse({ ticker, quantity });

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Errors:", error.issues);
    }

    return false;
  }
}

function validateBackendData(
  accountStocks: number | null,
  buyOrders: number | null
) {
  try {
    validationSchema.parse({ accountStocks, buyOrders });
    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Errors:", error.issues);
    }
    return false;
  }
}

export default async function ServerActionTest(formData: FormData) {
  //Get user email to see who is logged in
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    return "User not authenticated";
  }

  const formQuantity = formData.get("quantity") as string;
  const formTicker = formData.get("ticker") as string;
  console.log("attempting to buy", formQuantity, "shares of", formTicker);

  const isValidData = validateFormData(formTicker, formQuantity);
  console.log("Is form data valid?", isValidData);

  if (!isValidData) {
    return false;
  }

  const validTicker = formTicker.toString().toUpperCase();
  const validQuantity = Number(formQuantity);

  const promises = [
    validateFetch(validTicker),
    findTicker(validTicker, email),
    findDistinctTickers(email),
  ];
  const [stock, existingTicker, distinctTickers] = await Promise.all(promises);

  if (!stock) {
    console.error("No stock data found for ticker:", validTicker);
    return false;
  }

  const stockPrice = stock?.close;
  console.log("Stock price for", validTicker, "is", stockPrice);
  const buyOrders = existingTicker.length;
    console.log("Existing buy orders for", validTicker, ":", buyOrders);
  const accountStocks = distinctTickers.length;
    console.log("Distinct stocks owned:", accountStocks);

  const canPurchase = validateBackendData(accountStocks, buyOrders);
  console.log("Is backend data valid?", canPurchase);
  if (!canPurchase) {
    console.error("User cannot purchase more stocks");
    return false;
  }
  await createStock(
    validTicker,
    validQuantity,
    stockPrice,
    email
  );
  return true;


}
