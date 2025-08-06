import Link from 'next/link';
import styles from "@/components/navbar/navbar.module.css";
export default function Navbar() {
  return (
    <nav>
      <h1>Stock Dashboard</h1>
      <div className={styles.links}>
        <div><Link href="/">Account</Link></div>
        <div><Link href="/trade">Trade</Link></div>
        <div><Link href="/login">Login</Link></div>
      </div>
    </nav>
  );
}