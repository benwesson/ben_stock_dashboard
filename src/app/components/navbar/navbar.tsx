"use client";
import Link from "next/link";
import "@/globals.css";
import styles from "@/components/navbar/navbar.module.css";
import AuthLink from "@/components/authlink/authlink";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function Navbar() {
	const t = useTranslations("Navbar");
	const [isOpen, setIsOpen] = useState(false);
	useEffect(() => {
		function handleResize() {
			if (window.innerWidth > 769 && isOpen) {
				setIsOpen(false);
			}
		}

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, [isOpen]);

	return (
		<nav className={styles.container}>
			<div className={styles.links}>
				<Link
					className="rounded-md px-3 py-2 text-xl  text-gray-300 hover:bg-white/5 hover:text-white"
					href="/"
				>
					{t("account")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/funds"
				>
					{t("funds")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/buy"
				>
					{t("buy")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/sell"
				>
					{t("sell")}
				</Link>

				<AuthLink loginText={t("login")} logoutText={t("logout")} />
			</div>
			<div
				className={`${styles.hamburger} ${isOpen ? styles.change : ""}`}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className={styles.bar1} />
				<div className={styles.bar2} />
				<div className={styles.bar3} />
			</div>
			<div
				className={`${styles.dropDown} ${
					isOpen ? styles.dropDownOpen : ""
				}`}
				style={{ height: isOpen ? "250px" : "0px" }}
			>
				<Link
					className="rounded-md px-3 py-2 text-xl  text-gray-300 hover:bg-white/5 hover:text-white"
					href="/"
				>
					{t("account")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/funds"
				>
					{t("funds")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/buy"
				>
					{t("buy")}
				</Link>

				<Link
					className="rounded-md px-3 py-2 text-xl text-gray-300 hover:bg-white/5 hover:text-white"
					href="/sell"
				>
					{t("sell")}
				</Link>

				<AuthLink loginText={t("login")} logoutText={t("logout")} />
			</div>
			<div></div>
		</nav>
	);
}
