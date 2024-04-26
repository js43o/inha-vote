import { InputHTMLAttributes } from 'react';

type InputProps = {
  label?: string;
  error?: string;
};

export function Input({
  label,
  error,
  ...inputProps
}: InputProps & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label
      className={`flex flex-col gap-1 ${error ? 'text-red-500' : 'text-gray-500 '}`}
    >
      {label}
      <input
        className={`border rounded-md p-2.5 text-black ${error ? 'border-red-500' : 'border-gray-400'}`}
        {...inputProps}
      />
    </label>
  );
}
