import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardAction, 
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {getTranslations} from 'next-intl/server';

type Stock = { id: number; ticker: string; quantity: number; price: number };
type StockPrices = { [key: string]: { data: { close: number }[] } };

export default async function Positions({
  stocks,
  stockPrices,
}: {
  stocks: Stock[];
  stockPrices: StockPrices;
}) {
  const t = await getTranslations("Positions");
  const gainLoss = (stock: Stock) => {
    const currentPrice =
      stockPrices[stock.ticker.toUpperCase()]?.data[0]?.close || 0;
    return (currentPrice - stock.price) * stock.quantity;
  };

  // Build stockQuantities: { [ticker]: totalQuantity }
  const stockQuantities: { [ticker: string]: number } = {};
  stocks.forEach((stock) => {
    const t = stock.ticker.toUpperCase();
    stockQuantities[t] = (stockQuantities[t] || 0) + stock.quantity;
  });

  // Build chartData: { [ticker]: number[] } (array of prices, most recent first)
  const chartData: { [ticker: string]: number[] } = {};
  Object.entries(stockPrices).forEach(([ticker, priceObj]) => {
    chartData[ticker.toUpperCase()] = (priceObj?.data || []).map(
      (d) => d.close
    );
  });

  return (
    <Card>
      <CardContent>
        <h1>Your Positions</h1>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("Ticker")}</TableHead>
              <TableHead>{t("Quantity")}</TableHead>
              <TableHead>{t("Bought At")}</TableHead>
              <TableHead>{t("Current Price")}</TableHead>
              <TableHead>{t("Gain/Loss")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {stocks.length > 0 ? (
              stocks.map((stock) => {
                const currentPrice =
                  stockPrices[stock.ticker.toUpperCase()]?.data[0]?.close;
                return (
                  <TableRow key={stock.id}>
                    <TableCell>{stock.ticker.toUpperCase()}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>${stock.price.toFixed(2)}</TableCell>
                    <TableCell>
                      {typeof currentPrice === "number"
                        ? `$${currentPrice.toFixed(2)}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>${gainLoss(stock).toFixed(2)}</TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5}>No positions found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
