
type FundProps = {
  email: string;
  funds: number;
};


export default async function ShowFunds({ email, funds }: FundProps) {
    try {
        return <div> Current funds: {funds}</div>;
    } catch (error) {
        console.error("Error fetching funds:", error);
        return <div>Error fetching funds for: {email}</div>;
    }
}