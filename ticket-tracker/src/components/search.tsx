import { FormEventHandler, useState } from "react";
import { useRouter, usePathname} from 'next/navigation';

export default function Search () {
    const [value, setValue] = useState<string>();
    const { push } = useRouter();
    const pathname = usePathname();
    const handleOnSubmit : FormEventHandler<HTMLFormElement> = evt => {
        evt.preventDefault();
        push(`${pathname}results?artist=${value?.replace(/\s+/g, '-').toLowerCase()}`);
    }
    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <div className="flex justify-between w-full md:w-80">
                    <label>
                        Enter an artist
                    </label>
                </div>
                <div className="flex">
                    <input
                        className="bg-black text-white border border-1 border-white p-2"
                        type="text"
                        value={value || ''}
                        onChange={event => setValue(event.target.value)}
                    />
                </div>
            </form>
        </div>
    )
}