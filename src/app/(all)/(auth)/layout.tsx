import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/utils/authOptions";

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email) {
    redirect("/login");
  }

  return children;
}