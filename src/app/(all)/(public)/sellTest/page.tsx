
import PopulateSell from "@/actions/populateSell";
import handleSell from "@/actions/sellActions";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default async function SellTestPage() {
  const stocks = await PopulateSell();
  console.log("Fetched stocks:", stocks);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Sell Shares</CardTitle>
        <CardDescription>
          Enter the quantity of shares you want to sell.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={handleSell}>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a stock to sell" />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((item) => (
                <SelectItem
                  key={item.id}
                  value={`${item.ticker}-${item.id}`}
                  name="orderID"
                >
                  {item.ticker} - {item.quantity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            placeholder="Quantity to sell"
            min="1"
            max="100"
            className="mt-4 w-[180px]"
            name="sharesToSell"
          />
          <Button type="submit" className="mt-4 ">
            Sell
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
