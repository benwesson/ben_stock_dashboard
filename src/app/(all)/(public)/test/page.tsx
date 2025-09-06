"use client";
import { fetchStock } from "@/actions/stock_api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
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

const schema = z.object({
  ticker: z.string().min(1, "Ticker is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),

});

export default function TestPage() {
  return <div>Test Page</div>;
}
