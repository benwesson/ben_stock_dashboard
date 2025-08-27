"use client";

import { addFunds } from "@/api/prisma_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
type FundFormProps = {
  email: string;
  funds: number;
};

export default function FundForm({ email, funds }: FundFormProps) {
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const formQuantity = Number(formData.get("quantity"));
    const newFunds = funds + formQuantity;
    event.preventDefault();
    try {
      await addFunds(email, newFunds);
      alert(
        `Successfully added ${formQuantity} to funds. You now have ${newFunds} in your account.`
      );
    } catch (error) {
      alert("Error adding funds. Please try again.");
      console.error("Error adding funds:", error);
    }
  };
  return (
    <div>
      <p>Signed in as: {email}</p>
      <form onSubmit={handleSubmit}>
        <h1>Fund Your Account</h1>
        <Input
          type="number"
          placeholder="Amount"
          name="quantity"
          min={0.01}
          required
        />
        <Button type="submit">Add Funds</Button>
      </form>
     
    </div>
  );
}
