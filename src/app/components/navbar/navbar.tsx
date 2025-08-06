import Link from 'next/link';
import styles from "@/components/navbar/navbar.module.css";
export default function Navbar() {
  return (
    <div className={styles.container}>
      
      <div className={styles.links}>
        <div><Link href="/">Account</Link></div>
        <div><Link href="/trade">Trade</Link></div>
        <div><Link href="/login">Login</Link></div>
      </div>
    </div>
  );
}