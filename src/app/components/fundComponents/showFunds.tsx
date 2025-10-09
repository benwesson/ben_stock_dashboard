import { getTranslations } from "next-intl/server";
import { getFunds } from "@/actions/prisma_api";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export default async function ShowFunds() {
  const t = await getTranslations("ShowFunds");
  const funds = await getFunds();
 

  try {
    return (
      <Card className="mt-8">
        <CardContent>
          {<div>{t("funds")} ${funds.toFixed(2)}</div>}
         
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching funds:", error);
    return (
      <Card className="mt-8">
        <CardContent>Error fetching funds</CardContent>
      </Card>
    );
  }
}
