"use server";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import {
	findTicker,
	findDistinctTickers,
	createStock,
	addFunds,
	getFunds,
} from "@/actions/database/prisma_api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";
import validateFetch from "@/actions/validation/validateFetch";

//Define Zod schema for validation
const validationSchema = z.object({
	ticker: z
		.string()
		.regex(/^[A-Za-z]+$/, "Input must be alphabetic")
		.min(1, "Ticker is required"),

	quantity: z
		.string()
		.regex(/^\d+$/, "Quantity must be a number")
		.min(1, "Quantity is required"),
});

export type BuyProps = {
	ticker: string;
	quantity: string;
};

export interface BuyActionState extends BuyProps {
	message?: string;
	errors?: {
		ticker?: string[];
		quantity?: string[];
		accountStocks?: string[];
		buyOrders?: string[];
		funds?: string[];
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
	ticker: string,
	distinctTickers: { ticker: string }[],
	buyOrders: number
) {
	const upperTicker = ticker.toUpperCase();
	const ownedSet = new Set(
		distinctTickers.map((t) => t.ticker.toUpperCase())
	);
	const isExisting = ownedSet.has(upperTicker);

	if (buyOrders >= 3) {
		return {
			success: false,
			message: "User cannot have more than 3 buy orders for this ticker",
			errors: {
				buyOrders: [
					"User cannot have more than 3 buy orders for this ticker",
				],
			},
		};
	}

	if (!isExisting && ownedSet.size >= 4) {
		return {
			success: false,
			message: "User cannot own more than 4 distinct stocks",
			errors: {
				distinctTickers: [
					"User cannot own more than 4 distinct stocks",
				],
			},
		};
	}

	return { success: true };
}

export async function ServerActionTest(
	prevState: BuyActionState,
	formData: FormData
): Promise<BuyActionState> {
	//Get user email to see who is logged in
	const session = await getServerSession(authOptions);
	const email = session?.user?.email;
	console.log("User email from session:", email);

	if (!email) {
		return {
			ticker: "",
			quantity: "",
			message: "User email not found in session",
			errors: { ticker: ["User email not found in session"] },
		};
	}

	const formQuantity = formData.get("quantity") as string;
	const formTicker = formData.get("ticker") as string;
	console.log("attempting to buy", formQuantity, "shares of", formTicker);

	const isValidData = validateFormData(formTicker, formQuantity);
	console.log("Is form data valid?", isValidData);

	if (!isValidData) {
		return {
			ticker: "",
			quantity: "",
			message: "Invalid form data",
			errors: { ticker: ["invalid form data"] },
		};
	}

	const validTicker = formTicker.toString().toUpperCase();
	const validQuantity = Number(formQuantity);
	if (validQuantity <= 0 || validQuantity > 100) {
		return {
			ticker: "",
			quantity: formQuantity,
			message: "Quantity must be between 1 and 100",
			errors: { quantity: ["Quantity must be between 1 and 100"] },
		};
	}

	const promises = [
		validateFetch(validTicker),
		findTicker(validTicker, email),
		findDistinctTickers(email),
		getFunds(email),
	];
	const [stock, existingTicker, distinctTickers, funds] = await Promise.all(
		promises
	);

	if (!stock) {
		return {
			ticker: "",
			quantity: formQuantity,
			message: "No stock data found for ticker",
			errors: { ticker: ["No stock data found for ticker"] },
		};
	}

	if (!funds || funds <= 0) {
		return {
			ticker: validTicker,
			quantity: formQuantity,
			message: "Insufficient funds",
			errors: { funds: ["Insufficient funds"] },
		};
	}

	const stockPrice = stock?.close;
	console.log("Stock price for", validTicker, "is", stockPrice);
	const buyOrders = existingTicker.length;
	console.log("Existing buy orders for", validTicker, ":", buyOrders);
	const accountStocks = distinctTickers.length;
	console.log("Distinct stocks owned:", accountStocks);

	const canPurchase = validateBackendData(
		validTicker,
		distinctTickers,
		buyOrders
	);
	if (!canPurchase.success) {
		console.error("Backend validation failed:", canPurchase.errors);
		return {
			ticker: "",
			message: `Cannot proceed with purchase, ${canPurchase.message}`,
			quantity: formQuantity,
			errors: { ...canPurchase.errors },
		};
	}
	const orderCost = stockPrice * validQuantity;
	console.log("Total order cost:", orderCost);
	if (orderCost > funds) {
		console.error(
			"Insufficient funds:",
			funds,
			"available for order cost:",
			orderCost
		);
		return {
			ticker: validTicker,
			quantity: formQuantity,
			errors: { funds: ["Insufficient funds"] },
		};
	}

	revalidatePath("/buy");

	await createStock(validTicker, validQuantity, stockPrice, email);
	await addFunds(email, -orderCost);
	console.log(
		`Deducted $${orderCost.toFixed(2)} from user ${email}'s funds.`
	);
	console.log("Purchase recorded in database");

	return { ticker: validTicker, quantity: formQuantity, errors: {} };
}
