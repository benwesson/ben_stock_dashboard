import { getTranslations } from "next-intl/server";
import { Setup } from "@/actions/general/setup";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default async function Positions({ data }: { data: Setup }) {
  const t = await getTranslations("Positions");
  if (data.success === false) {
    return <div>{data.message}</div>;
  }
  return (
    <Card className="mt-8">
      <CardHeader>
          <CardTitle>{t("accountSummary")}</CardTitle>
          <CardDescription>
            {t("overview")}
          </CardDescription>
        </CardHeader>
      <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("orderId")}</TableHead>
          <TableHead>{t("ticker")}</TableHead>
          <TableHead>{t("shares")}</TableHead>
          <TableHead>{t("purchasePrice")}</TableHead>
          <TableHead>{t("currentPrice")}</TableHead>
          <TableHead>{t("gainLoss")}</TableHead> 
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data.data) &&
          data.data.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.id}</TableCell>
              <TableCell>{position.ticker}</TableCell>
              <TableCell>{position.quantity}</TableCell>
              <TableCell>{position.boughtAt}</TableCell>
              <TableCell>{position.currentPrice}</TableCell>
              <TableCell>{(position.currentPrice - position.boughtAt).toFixed(2)}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    </CardContent>
  </Card>
);
}