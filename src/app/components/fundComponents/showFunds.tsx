
import { getFunds } from "@/api/prisma_api";

type FundFormProps = {
  email: string;
};


export default async function ShowFunds({ email }: FundFormProps) {
    try {
        const funds = await getFunds(email);
        return <div> Current funds: {funds.toFixed(2)}</div>;
    } catch (error) {
        console.error("Error fetching funds:", error);
        return <div>Error fetching funds for: {email}</div>;
    }
}