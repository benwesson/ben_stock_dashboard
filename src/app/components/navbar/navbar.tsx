"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@/components/navbar/navbar.module.css";
import AuthLink from "@/components/authlink/authlink";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function Navbar() {
  const [locale, setLocale] = useState("en");
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        <div>
          <Link href="/">Account</Link>
        </div>
        <div>
          <Link href="/funds">Funds</Link>
        </div>
        <div>
          <Link href="/buy">Buy</Link>
        </div>
        <div>
          <Link href="/sell">Sell</Link>
        </div>
        <div>
          <AuthLink />
        </div>
        <div>
          <Select>
            <SelectTrigger >
              <SelectValue placeholder="EN" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="en"><button>EN</button></SelectItem>
              <SelectItem value="fr"><button>FR</button></SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
