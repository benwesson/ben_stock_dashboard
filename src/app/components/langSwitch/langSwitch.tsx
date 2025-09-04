'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {setLocaleAction} from '@/actions/actions';

type Props = {
  value: string; // current locale, e.g. "en"
};

export default function LanguageSelect({value}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.size ? `?${searchParams.toString()}` : '';
  const redirectTo = `${pathname}${qs}`;

  return (
    <form action={setLocaleAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <select
        name="locale"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        {/* add more locales here */}
      </select>
    </form>
  );
}