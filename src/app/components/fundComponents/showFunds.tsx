import { getTranslations } from "next-intl/server";
import { getFunds } from "@/actions/database/prisma_api";
import { Card, CardContent } from "@/components/ui/card";

export default async function ShowFunds() {
	const t = await getTranslations("ShowFunds");
	const funds = await getFunds();

	return (
		<Card className="mt-8">
			<CardContent>
				{
					<div>
						{t("funds")} ${funds.toFixed(2)}
					</div>
				}
			</CardContent>
		</Card>
	);
}
