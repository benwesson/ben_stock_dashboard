"use client";
import { fetchStock } from "@/actions/stock_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { handleSearch } from "@/actions/formValidation";
import {
  createStock,
  findTicker,
  findDistinctTickers,
  addFunds,
} from "@/actions/prisma_api";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



export default function TestPage() {
  // Wrap handleSearch to ensure it returns Promise<void>
  const handleFormAction = async (formData: FormData) => {
    await handleSearch(formData);
    // Optionally handle result or errors here
  };

  return (
    <form action={handleFormAction}>
      <input type="text" name="ticker" placeholder="Ticker" required/>
      <button type="submit">Search</button>
    </form>
  );
}
