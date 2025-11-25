"use client";
import { useActionState, useState } from "react";
import { ServerActionTest, BuyActionState } from "@/actions/buy/buyAction";
import {
	SearchActionState,
	handleSearch,
	fetchTickerData,
} from "@/actions/buy/searchValidation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";

const initialFormState: SearchActionState = {
	message: " ",
};

const initialBuyState: BuyActionState = {
	quantity: "0",
	ticker: "",
};

export default function BuyComponent() {
	function refreshPage() {
		window.location.reload();
	}
	const t = useTranslations("BuyComponent");
	const [tickerState, setTickerState] = useState<SearchActionState>({});

	const [state, formAction, pending] = useActionState(
		async (prevState: SearchActionState, formData: FormData) => {
			const res = await fetchTickerData(prevState, formData);

			if (!res.ticker) return res;

			setTickerState(await handleSearch(res.ticker));

			return res;
		},
		initialFormState
	);
	const [buyState, buyAction, buyPending] = useActionState(
		async (prevState: BuyActionState, formData: FormData) => {
			const res = await ServerActionTest(prevState, formData);

			if (!res.ticker) return res;

			setTickerState(await handleSearch(res.ticker));

			return res;
		},
		initialBuyState
	);

	return (
		<>
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
					) : state.message ? (
						<div className="ml-2">{state.message}</div>
					) : (
						<>
							<div className="ml-2">
								<div>
									{t("ticker")}: {state.ticker}
								</div>
								<div>
									{t("currentPrice")}:{" "}
									{tickerState.stockPrice}
								</div>
								<div>
									{t("shares")}:{" "}
									{tickerState.totalSharesOwned}
								</div>
								<div>
									{t("accountStocks")}:{" "}
									{tickerState.accountStocks}
								</div>
								<div>
									{t("buyOrders")}: {tickerState.buyOrders}
								</div>
							</div>
							<form action={buyAction}>
								<div className="flex space-x-2 mt-4">
									<Input
										className="w-60  "
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
						</>
					)}
				</CardContent>
			</Card>
			<Card className="mt-4">
				<CardContent>
					<div className="flex items-center">
						<Button className="mr-8" onClick={refreshPage}>
							Refresh
						</Button>
						{buyPending ? (
							<div className="">{t("loading")}</div>
						) : (
							buyState.message
						)}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
