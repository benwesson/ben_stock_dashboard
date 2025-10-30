"use server";

import { z } from "zod";
import { cookies } from "next/headers";

const schema = z.object({
	locale: z.union([z.literal("en"), z.literal("fr"), z.literal("es")]),
});

type Props = z.infer<typeof schema>;

export async function setLocaleAction(formData: FormData) {
	const formSelection = formData.get("locale") as string;
	const safeSelection = schema.safeParse({ locale: formSelection });

	const { locale }: Props = safeSelection.success
		? safeSelection.data
		: { locale: "en" };

	if (!safeSelection.success) {
		console.log("errors:", safeSelection.error.issues);
	} else {
		(await cookies()).set("locale", locale, {
			path: "/",
			maxAge: 60 * 60 * 24 * 365, // 1 year
			sameSite: "lax",
		});
	}
}
