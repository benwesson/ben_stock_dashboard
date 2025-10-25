'use client';
import { useActionState } from 'react';
import {usePathname, useSearchParams} from 'next/navigation';
import {setLocaleAction} from '@/actions/actions';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRef } from 'react';

type Props = {
  value: string; // current locale, e.g. "en"
};

export default function LanguageSelect({value}: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const qs = searchParams.size ? `?${searchParams.toString()}` : '';
  const redirectTo = `${pathname}${qs}`;
  const formRef = useRef<HTMLFormElement>(null);

 
  const handleValueChange = (newLocale: string) => {
    // Update hidden input and submit form
    if (formRef.current) {
      const localeInput = formRef.current.querySelector('input[name="locale"]') as HTMLInputElement;
      if (localeInput) {
        localeInput.value = newLocale;
      }
      formRef.current.requestSubmit();
    }
  };

  return (
    <form 
      ref={formRef}
      action={setLocaleAction} 
      className='mt-8'
     
    >
      <input type="hidden" name="redirectTo" value={redirectTo} />
      <input type="hidden" name="locale" value={value} />
      <Select value={value} onValueChange={handleValueChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="fr">French</SelectItem>
          <SelectItem value="es">Spanish</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
