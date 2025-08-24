"use client";
import { Button } from "@chakra-ui/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "authenticated") return null;

  return (
    <div>
      <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
        Sign in with Google
      </Button>
      
    </div>
  );
}