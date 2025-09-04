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
type FundProps = {
  email: string;
  funds: number;
};

export default async function ShowFunds({ email, funds }: FundProps) {
  const t = await getTranslations('HomePage');
  try {
    return (
      <Card className="mt-8">
       
        <CardContent>Current funds: ${funds.toFixed(2)}</CardContent>
         <h1>{t('title')}</h1>
          <p>{t('content')}</p>
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
