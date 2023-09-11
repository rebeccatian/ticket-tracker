import { ChangeEventHandler, FormEventHandler, InputHTMLAttributes, useState } from "react";

type TextInputElement = Pick<InputHTMLAttributes<HTMLInputElement>, 'value'| 'onChange' | 'placeholder' | 'disabled'>;

interface InputFieldProps extends TextInputElement {
    label?: string
    onSubmit?: FormEventHandler<HTMLFormElement>
    className?: string
}

export default function InputTextField ({ label, onSubmit, value, onChange, placeholder, className, disabled } : InputFieldProps) {
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

    const inputClassNames = `bg-black text-white border border-1 border-stone-400 p-2 rounded-sm ${className}`

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
                        disabled={disabled}
                        placeholder={placeholder}
                        className={inputClassNames}
                        type="text"
                        value={value || ''}
                        onChange={handleOnChange}
                    />
                </div>
            </form>
        </div>
    )
}