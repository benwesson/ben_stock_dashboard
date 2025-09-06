"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const schema = z.object({
  locale: z.union([z.literal("en"), z.literal("fr"), z.literal("es")]),
  redirectTo: z.string().optional(),
});

type Props = z.infer<typeof schema>;

export async function setLocaleAction(formData: FormData) {
  const { locale, redirectTo }: Props = {
    locale: formData.get("locale") || "en",
    redirectTo: formData.get("redirectTo") || "/",
  };

  const safeData = schema.safeParse({
    locale: locale,
    redirectTo: redirectTo,
  });

  if (!safeData.success) {
    return {
      errors: safeData.error.flatten().fieldErrors,
    };
  } else {
    (await cookies()).set("locale", locale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });

    redirect(redirectTo);
  }
}
