"use client"
import { useSession, signOut } from "next-auth/react";
//import styles from "./authLinks.module.css";
import Link from "next/link";

export default function AuthLink({ loginText, logoutText }: { loginText: string; logoutText: string }) {
    const { status } = useSession();

    return (
        <div>
            {status === "unauthenticated" ? (
                <Link className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" href="/login">{loginText}</Link>
            ) : (   
                <span className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-white/5 hover:text-white" onClick={() => signOut()}>{logoutText}</span>
            )}
        </div>
    );
}