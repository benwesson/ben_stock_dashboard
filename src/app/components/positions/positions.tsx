
import { SetupType } from "@/actions/general/setup";
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
export default function Positions({ data }: { data: SetupType }) {
  if (data.success === false) {
    return <div>{data.message}</div>;
  }
  return (
    <Card className="mt-8">
      <CardHeader>
          <CardTitle>Account Summary</CardTitle>
          <CardDescription>
            Overview of your current stock positions by order
          </CardDescription>
        </CardHeader>
      <CardContent>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order ID</TableHead>
          <TableHead>Ticker</TableHead>
          <TableHead>Shares</TableHead>
          <TableHead>Purchase Price</TableHead>
          <TableHead>Current Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.isArray(data) &&
          data.map((position) => (
            <TableRow key={position.id}>
              <TableCell>{position.id}</TableCell>
              <TableCell>{position.ticker}</TableCell>
              <TableCell>{position.quantity}</TableCell>
              <TableCell>{position.boughtAt}</TableCell>
              <TableCell>{position.currentPrice}</TableCell>
            </TableRow>
          ))}
      </TableBody>
    </Table>
    </CardContent>
  </Card>
);
}