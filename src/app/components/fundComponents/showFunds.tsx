import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
type FundProps = {
  email: string;
  funds: number;
};

export default async function ShowFunds({ email, funds }: FundProps) {
  try {
    return (
      <Card className="mt-8">
       
        <CardContent>Current funds: ${funds.toFixed(2)}</CardContent>
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
