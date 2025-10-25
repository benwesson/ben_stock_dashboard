import Link from "next/link";
import "@/globals.css"
import styles from "@/components/navbar/navbar.module.css";
import AuthLink from "@/components/authlink/authlink";


import { getTranslations } from "next-intl/server";


export default async function Navbar() {  
  
  const t = await getTranslations("Navbar");

  return (
    <div className={styles.container}>
      <div className={styles.links}>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/">{t("account")}</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/funds">{t("funds")}</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white"   href="/buy">{t("buy")}</Link>
        </div>
        <div>
          <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/sell">{t("sell")}</Link>
        </div>
        <div>
          <AuthLink loginText={t("login")} logoutText={t("logout")} />
        </div>
      </div>
    </div>
  );
}
