import { InputHTMLAttributes, forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterInput } from '~/lib/types';

type InputProps = {
  label?: string;
  error?: string;
};

export const Input = forwardRef<
  HTMLInputElement,
  InputProps &
    InputHTMLAttributes<HTMLInputElement> &
    ReturnType<UseFormRegister<RegisterInput>>
>(({ onChange, onBlur, name, label, error, ...props }, ref) => (
  <label
    className={`flex flex-col gap-1 ${error ? 'text-red-500' : 'text-gray-500 '}`}
  >
    {label}
    <input
      className={`border rounded-md p-2.5 text-black ${error ? 'border-red-500' : 'border-gray-400'}`}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
      ref={ref}
    />
    <div className="text-sm">{error}</div>
  </label>
));
