"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log in to your account</CardDescription>
          
        </CardHeader>
        <CardContent>
          
          <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
            Sign in with Google
          </Button>
          <br></br>
          <Button className="mt-8" >
            Sign in with Github
          </Button>
          

        </CardContent>
        <CardFooter>
        
        </CardFooter>
      </Card>
    </div>
  );
}
