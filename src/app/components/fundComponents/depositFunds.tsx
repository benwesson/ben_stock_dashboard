"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundAction, FundActionState } from "@/actions/fundAction";
import { useActionState } from "react";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const initialFormState: FundActionState = {};

export default function DepositFunds() {
	const t = useTranslations("DepositFunds");
	const [state, formAction, pending] = useActionState(
		fundAction,
		initialFormState
	);

	return (
		<>
			<Card className="mt-8">
				<CardHeader>
					<CardTitle>{t("title")}</CardTitle>
					<CardDescription>{t("description")}</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={formAction}>
						<div className="flex gap-2">
							<Input
								type="number"
								placeholder={t("amountPlaceholder")}
								name="amount"
								required
							/>
							<Button type="submit">{t("depositButton")}</Button>
						</div>
					</form>
					
					{pending && <div>{t("loading")}</div>}
					
					{!pending && state.errors && (
						<div style={{ color: "red" }}>
							{Object.values(state.errors).map((error, index) => (
								<div key={index}>{error}</div>
							))}
						</div>
					)}
					
					{!pending && !state.errors && state.amount && (
						<div>
							{t("success")}: {state.amount}
						</div>
					)}
				</CardContent>
			</Card>
		</>
	);
}
