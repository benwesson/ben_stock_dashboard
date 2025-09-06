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
import { getServerSession } from "next-auth";
import { authOptions } from "@/utils/authOptions";

export default async function Navbar({ locale }: { locale: string }) {  
  const session = await getServerSession(authOptions);

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
      </div>
    </div>
  );
}
