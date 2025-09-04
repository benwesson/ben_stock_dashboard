'use server';

import {cookies} from 'next/headers';
import {redirect} from 'next/navigation';

export async function setLocaleAction(formData: FormData) {
  const locale = String(formData.get('locale') ?? 'en');
  const redirectTo = String(formData.get('redirectTo') ?? '/');

  (await cookies()).set('locale', locale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax'
  });

  redirect(redirectTo);
}