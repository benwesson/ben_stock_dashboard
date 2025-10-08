"use server";
import { z } from "zod";
import { findStockOrder, updateStock, deleteStock, addFunds} from "@/actions/prisma_api";
import { fetchStock } from "@/actions/stock_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";


//Define Zod schema for validation
const validationSchema = z.object({
  orderID: z
    .string()
    .regex(/^\d+$/, "Order ID must be a number")
    .min(1, "Order ID is required").optional(),

  quantity: z
    .string()
    .regex(/^\d+$/, "Quantity must be a number")
    .min(1, "Quantity is required").optional(),
});

export type SellProps = z.infer<typeof validationSchema>;

export interface SellActionState extends SellProps {
  success?: boolean;
  message?: string;
  sale?: string;
  ticker?: string;
  errors?: {
    ticker?: string[];
    sale?: string[];
    success?: boolean;
    orderID?: string[];
    quantity?: string[];
  };
}

function validateFormData(orderID: string | null, quantity: string | null) {
  try {
    validationSchema.parse({ orderID, quantity });

    return true;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("Validation Errors:", error.issues);
    }

    return false;
  }
}

async function validateBackendData(
  orderID: number,
  quantity: number,
  
  email: string
) {
  const orderData = await findStockOrder(orderID, email);
  
  if (!orderData) {
    console.error("No order data found for order ID:", orderID);
    return {
      success: false,
      errors: {
        orderID: ["No order data found for this order ID"],
      },
    };
  }

  const currentPrice = await fetchStock(orderData?.ticker,1)
  

  if (quantity > orderData.quantity || orderData.quantity <= 0) {
    return {
      success: false,
      errors: {
        quantity: ["Insufficient quantity to sell"],
      },
    };
  } else if (quantity == orderData.quantity) {
    await deleteStock(email, orderID);
    const funds = (currentPrice * quantity);
    await addFunds(email, funds ? funds : 0);
    return {
      success: true,
      message: "All shares sold, order deleted",
    };
  }
  // If partial sell, update the stock quantity
  const saleQuantity = orderData.quantity - quantity;
  await updateStock(saleQuantity, email, orderID);
  const funds = (currentPrice * quantity);
  await addFunds(email, funds ? funds : 0);
  return { success: true };
}
export default async function sellAction( prevState: SellActionState,formData: FormData): Promise<SellActionState> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    return {
      ticker: "",
      errors: { ticker: ["User email not found in session"] },
    };
  }

  const orderID = formData.get("orderIDToSell") as string;
  const quantity = formData.get("sharesToSell") as string;
  
  console.log("Order ID to sell:", orderID);
  console.log("Quantity of shares to sell:", quantity);

  const isValidData = validateFormData(orderID, quantity);

  if (!isValidData) {
    return {
      orderID: "",
      errors: { orderID: ["invalid form data"] },
    };
  }

  console.log("Is form data valid?", isValidData);
  const validOrderID = parseInt(orderID, 10);
  const validQuantity = parseInt(quantity, 10);
  

  const isValidBackend = await validateBackendData(
    validOrderID,
    validQuantity,
    email
  );
  console.log("Backend validation result:", isValidBackend);
  if (!isValidBackend.success) {
    return {
      orderID: "",
      errors: isValidBackend.errors,
    };
  }
  console.log("Is backend data valid?", isValidBackend.success);

  console.log("Stock updated successfully");
  
  // console.log(`Added $${sale.toFixed(2)} to user ${email}'s funds.`);
  return {
    orderID: String(orderID),
    quantity: String(quantity),
    
    success: true
  }
}
