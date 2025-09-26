"use server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { findStockOrder, addFunds, updateStock } from "@/actions/prisma_api";
import { fetchStock } from "@/actions/stock_api";

//Define Zod schema for validation
const validationSchema = z.object({
  orderID: z
    .number("The order ID must be a number")
    .min(1, "Order ID is required"),
  sharesToSell: z
    .number("The shares to sell must be a number")
    .min(1, "You must sell at least 1 share")
    .max(100, "You can only sell 100 shares at a time"),
});

export async function populateSelectOptions() {
  function validateSellInput(
    orderID: FormDataEntryValue | null,
    sharesToSell: FormDataEntryValue | null
  ) {
    try {
      validationSchema.parse({ orderID, sharesToSell });
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation Errors:", error.issues);
      }
      return false;
    }
  }

  //Get user email to see who is logged in
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    throw new Error("User not authenticated");
  }

  //Get ticker from input in form
  const formOrderID = formData.get("orderID");

  //Get quantity of shares to sell
  const formQuantity = formData.get("sharesToSell");

  //Parse form data with zod schema
  const isValidData = validateSellInput(formOrderID, formQuantity);

  //If data is correct type continue
  if (isValidData) {
    const promises = [findStockOrder(formOrderID, email)];
    const [stockOrder] = await Promise.all(promises);

    if (!stockOrder) {
      console.error("No stocks found for user:", email);
    }

    const ownedShares = stockOrder!.quantity;
    const ticker = stockOrder!.ticker;
    const sharesToSell = Number(formQuantity);

    //Check if user owns enough shares to sell
    if (ownedShares < sharesToSell) {
      throw new Error(
        `You cannot sell more shares than you own. You own ${ownedShares} shares of ${ticker}.`
      );
    }

    //Fetch current stock price for ticker
    const stockData = await fetchStock(ticker);
    const currentPrice = stockData?.data?.[0]?.price;

    const fundsToAdd = Number((currentPrice * sharesToSell).toFixed(2));
    try {
      await updateStock(ticker, ownedShares - sharesToSell, email, formOrderID);
      console.log(
        `Sold ${sharesToSell} shares of ${ticker} at $${currentPrice} each for a total of $${fundsToAdd}.`
      );
      await addFunds(email, fundsToAdd);
    } catch (error) {
      console.error("Error selling stock:", error);
    }
  }
}
