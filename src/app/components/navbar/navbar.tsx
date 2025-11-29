"use client";
import Link from "next/link";
import "@/globals.css";
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
		<nav className="sticky top-0 flex flex-row justify-end items-center h-[100px] bg-black">
			<div className="hidden md:flex md:justify-end md:items-center md:gap-4 md:max-w-[1200px] md:w-full md:px-5 md:mx-auto">
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
				className={"cursor-pointer md:hidden mr-5"}
				onClick={() => setIsOpen(!isOpen)}
			>
				<div className={`h-[5px] w-[35px] bg-white my-[6px] transition-all duration-[250ms] ease-linear ${ isOpen ? "translate-y-[11px] -rotate-45" : ""}`} />
				<div className={`h-[5px] w-[35px] bg-white my-[6px] transition-all duration-[250ms] ease-linear ${ isOpen ? "opacity-0" : ""}`} />
				<div className={`h-[5px] w-[35px] bg-white my-[6px] transition-all duration-[250ms] ease-linear ${ isOpen ? "translate-y-[-11px] rotate-45" : ""}`} />
			</div>
			<div
				className={`fixed top-[100px] w-full bg-black text-white flex flex-col items-center justify-center cursor-pointer overflow-hidden transition-[height] duration-[400ms] ${
					isOpen ? "h-[250px]" : "h-0"
				}`}
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
