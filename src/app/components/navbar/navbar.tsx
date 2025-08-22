import Link from 'next/link';
 import styles from "@/components/navbar/navbar.module.css";
import AuthLink from "@/components/authlink/authlink";
export default function Navbar() {
  return (
    <div className={styles.container}>

      <div className={styles.links} >
        <div><Link href="/">Account</Link></div>
        <div><Link href="/funds">Funds</Link></div>
        <div><Link href="/buy">Buy</Link></div>
        <div><Link href="/sell">Sell</Link></div>
        <div><AuthLink /></div>
      </div>
    </div>
  );
} 