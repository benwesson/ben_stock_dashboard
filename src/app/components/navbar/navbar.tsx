import Link from "next/link";
import "@/globals.css"
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
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/">Account</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/funds">Funds</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"   href="/buy">Buy</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/sell">Sell</Link>
        </div>
        <div>
          <AuthLink />
        </div>
      </div>
    </div>
  );
}
