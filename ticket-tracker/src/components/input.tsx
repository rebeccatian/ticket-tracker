import { ChangeEventHandler, FormEventHandler, InputHTMLAttributes, useState } from "react";

type TextInputElement = Pick<InputHTMLAttributes<HTMLInputElement>, 'value'| 'onChange'>;

interface InputFieldProps extends TextInputElement {
    label: string
    onSubmit: FormEventHandler<HTMLFormElement>
}

export default function InputTextField ({ label, onSubmit, value, onChange } : InputFieldProps) {
    const handleOnSubmit : FormEventHandler<HTMLFormElement> = evt => {
        evt.preventDefault();
        if (onSubmit) {
            onSubmit(evt);
        }
    }

    const handleOnChange : ChangeEventHandler<HTMLInputElement> = evt => {
        if (onChange) {
            onChange(evt);
        }
    }
    return (
        <div>
            <form onSubmit={handleOnSubmit}>
                <div className="flex justify-between w-full md:w-80">
                    <label>
                        {label}
                    </label>
                </div>
                <div className="flex">
                    <input
                        className="bg-black text-white border border-1 border-white p-2"
                        type="text"
                        value={value || ''}
                        onChange={handleOnChange}
                    />
                </div>
            </form>
        </div>
    )
}