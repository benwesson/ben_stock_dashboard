'use client';

import {usePathname, useSearchParams} from 'next/navigation';
import {setLocaleAction} from '@/actions/actions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


type Props = {
  value: string; // current locale, e.g. "en"
};

export default function LanguageSelect({value}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.size ? `?${searchParams.toString()}` : '';
  const redirectTo = `${pathname}${qs}`;

  return (
    <form action={setLocaleAction} className='mt-4 inline-block w-fit min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs'>
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <select
        name="locale"
        defaultValue={value}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        <option value="en">English</option>
        <option value="fr">French</option>
        <option value="es">Spanish</option>
        {/* add more locales here */}
      </select>
    </form>
  );
}