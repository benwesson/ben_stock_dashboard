import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
type FundProps = {
  email: string;
  funds: number;
};

export default async function ShowFunds({ email, funds }: FundProps) {
  const t = await getTranslations("ShowFunds");
  try {
    return (
      <Card className="mt-8">
        <CardContent>
          <div>{t("funds")} ${funds.toFixed(2)}</div>
         
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Error fetching funds:", error);
    return (
      <Card className="mt-8">
        <CardContent>Error fetching funds for: {email}</CardContent>
      </Card>
    );
  }
}
