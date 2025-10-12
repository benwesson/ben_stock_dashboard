"use client";
import { useActionState, useState, useEffect } from "react";
import { ServerActionTest, BuyActionState } from "@/actions/buy/buyAction";
import {
	SearchActionState,
	handleSearch,
} from "@/actions/buy/searchValidation";
import { useTranslations } from "next-intl";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const initialFormState: SearchActionState = {
	ticker: "",
};

const initialBuyState: BuyActionState = {
	quantity: "0",
	ticker: "",
};

export default function BuyComponent() {
	const t = useTranslations("BuyComponent");
	const [state, formAction, pending] = useActionState(
		handleSearch,
		initialFormState
	);
	const [buyState, buyAction, buyPending] = useActionState(
		ServerActionTest,
		initialBuyState
	);
	const [buySubmitted, setBuySubmitted] = useState(false);

	// reset submission flag when the searched ticker changes
	useEffect(() => setBuySubmitted(false), [state.ticker]);

	return (
		<Card className="mt-8">
			<CardContent>
				<form action={formAction}>
					<div className="flex space-x-2">
						<Input
							className="w-32 mb-4"
							type="text"
							name="ticker"
							placeholder={t("searchPlaceholder")}
							required
						/>
						<Button type="submit">{t("searchButton")}</Button>
					</div>
				</form>

				{pending ? (
					<div>{t("loading")}</div>
				) : state.errors ? (
					<div style={{ color: "red" }}>
						{Object.values(state.errors).map((error, index) => (
							<div key={index}>{error}</div>
						))}
					</div>
				) : (
					state.ticker && (
						<>
							<div className="ml-1">
								<div>
									{t("ticker")}: {state.ticker}
								</div>
								<div>
									{t("currentPrice")}: {state.stockPrice}
								</div>
								<div>
									{t("shares")}: {state.totalSharesOwned}
								</div>
								<div>
									{t("accountStocks")}: {state.accountStocks}
								</div>
								<div>
									{t("buyOrders")}: {state.buyOrders}
								</div>
							</div>
							<form
								action={buyAction}
								onSubmit={() => setBuySubmitted(true)}
							>
								<div className="flex space-x-2 mt-4">
									<Input
										className="w-32  "
										type="number"
										name="quantity"
										placeholder={t("buyPlaceholder")}
										min="1"
										max="100"
										required
									/>

									<input
										className="hidden"
										type="hidden"
										name="ticker"
										value={state.ticker}
									/>
									<Button type="submit">
										{t("buyButton")}
									</Button>
								</div>
							</form>

							{buyPending ? (
								<div>{t("processingPurchase")}</div>
							) : buySubmitted ? (
								buyState.errors ? (
									<div style={{ color: "red" }}>
										{Object.values(buyState.errors).map(
											(error, index) => (
												<div key={index}>{error}</div>
											)
										)}
									</div>
								) : (
									<div>{t("purchaseSuccess")}</div>
								)
							) : null}
						</>
					)
				)}
			</CardContent>
		</Card>
	);
}
