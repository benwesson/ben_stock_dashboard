"use client";


import { addFunds } from "@/api/prisma_api";
import { Button, Input, Form } from "@chakra-ui/react"
type FundFormProps = {
  email: string;
};

export default function FundForm({ email }: FundFormProps) {
  

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget);
    const formQuantity = Number(formData.get("quantity"));
    event.preventDefault();
    try {
      await addFunds(email, formQuantity);
      alert(`Successfully added ${formQuantity} to funds.`);
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
        <Input type="number" placeholder="Amount" name="quantity" required />
        <Button type="submit">Add Funds</Button>

      </form>
    </div>
  );
}