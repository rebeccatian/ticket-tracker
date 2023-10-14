import { Inter } from 'next/font/google'
import InputTextField from '../components/input';
import { useRouter, usePathname} from 'next/navigation';
import { ChangeEventHandler, FormEventHandler, useState } from 'react';

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
      className={`flex flex-col space-y-12 p-24 ${inter.className}`}
    >
      <InputTextField 
        label="Enter an artist"
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        value={value}
      />
      <div className={email ? 'opacity-100' : 'opacity-70'}>
        <p>Already have selected events?</p>
        <InputTextField 
          label="Enter an email"
          onSubmit={handleEmailSubmit}
          onChange={handleEmailChange}
          value={email}
        />
      </div>
    </main>
  )
}
