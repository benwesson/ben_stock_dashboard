"use server";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import { addFunds } from "@/actions/prisma_api";


//Define Zod schema for validation
const usdRegex = /^\$?\s*(?:\d{1,3}(?:,\d{3})+|\d+)(?:\.\d{1,2})?$/;

const validationSchema = z.object({
  amount: z
    .string()
    .trim()
    .refine((s) => usdRegex.test(s), "Enter a USD amount like 1,234.56")
    .transform((s) => s.replace(/[$,\s,]/g, "")) // remove $, commas, spaces
    .transform((s) => Number(s))
    .refine(
      (n) => Number.isFinite(n) && n > 0,
      "Amount must be greater than 0"
    )
    
});

export type FundProps = {
  amount: string;
}

export interface FundActionState  {
  success?: boolean;
  message?: string;
  amount?: number;
  errors?: {
    email?: string[];
    amount?: string[];
    success?: boolean;
  };
}

function validateAmount(amount: string | null) {
  try {
    validationSchema.parse({ amount });
  } catch (error) {
    console.error("Validation error:", error);
    return false;
  }
  return true;
}

export async function fundAction(prevState: FundActionState, formData: FormData): Promise<FundActionState> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  console.log("User email from session:", email);

  if (!email) {
    return {
      
      errors: { email: ["User email not found in session"] },
    };
  }

  const formAmount = formData.get("amount") as string;
  console.log("Form Amount:", formAmount);
  
  const isValid = validateAmount(formAmount);
  console.log("Is amount valid?", isValid);
  
  if (!isValid) {
   return {
      errors: { amount: ["Invalid amount format"] },
    };
  }
  
  const validAmount = parseFloat(formAmount.replace(/[$,\s,]/g, ""));
  
  if (validAmount > 1000000) {
    console.log("Amount exceeds maximum limit");
    return {  
      errors: { amount: ["Amount must be less than or equal to 1,000,000"] },
    };
  }
  
  await addFunds(email, validAmount);
  
  console.log(`Added $${validAmount} to account for ${email}`);
  
  return {
    amount: validAmount,
    errors: {},
  };
}
