import { Inter } from 'next/font/google'
import InputTextField from '../components/input';
import { useRouter, usePathname} from 'next/navigation';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { push } = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState<string>();
  const [email, setEmail] = useState<string>();

  const handleOnSubmit : FormEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault();
    push(`${pathname}results?artist=${value?.replace(/\s+/g, '-').toLowerCase()}`);
  }

  const handleOnChange : ChangeEventHandler<HTMLInputElement> = evt => {
    setValue(evt.target.value)
  }

  const handleEmailSubmit : FormEventHandler<HTMLFormElement> = evt => {
    evt.preventDefault();
    push(`${pathname}profile?email=${email?.toLowerCase()}`);
  }

  const handleEmailChange : ChangeEventHandler<HTMLInputElement> = evt => {
    setEmail(evt.target.value)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <InputTextField 
        label="Enter an artist"
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        value={value}
      />
      <InputTextField 
        label="Enter an email"
        onSubmit={handleEmailSubmit}
        onChange={handleEmailChange}
        value={email}
      />
    </main>
  )
}
