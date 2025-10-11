
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fundAction } from "@/actions/fundAction";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function DepositFunds() {
  const t = await getTranslations("DepositFunds");
  return (
    <>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={fundAction}>
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
    </>
  );
}
