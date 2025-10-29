"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundAction, FundActionState } from "@/actions/accoutFunds/fundAction";
import { useActionState } from "react";
import {
	Card,
	CardContent,
	CardDescription,
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

	function refreshPage() {
		window.location.reload();
	}

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
				</CardContent>
			</Card>
			<Card className="mt-4">
				<CardContent>
					<div className="flex items-center">
						<Button className="mr-8" onClick={refreshPage}>
							Refresh
						</Button>
						{pending ? (<div className="">{t("loading")}</div>) : (state.message)}
					</div>
				</CardContent>
			</Card>
		</>
	);
}
