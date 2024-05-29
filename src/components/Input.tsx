import { InputHTMLAttributes, forwardRef } from 'react';

type InputProps = {
  label: string;
  error?: boolean;
  grouped?: boolean;
};

export const Input = forwardRef<
  HTMLInputElement,
  InputProps & InputHTMLAttributes<HTMLInputElement>
>(
  (
    {
      label,
      className,
      error = false,
      grouped = false,
      disabled,
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) => (
    <input
      className={`${error ? 'bg-red-100 border-danger' : disabled ? 'bg-gray-100' : 'bg-white'} ${grouped ? 'border-b border-gray-300 ' : 'border border-gray-400 rounded-lg'} min-w-0 w-full p-2.5 transition-colors ${className}`}
      placeholder={label}
      onChange={onChange}
      onBlur={onBlur}
      disabled={disabled}
      {...props}
      ref={ref}
    />
  ),
);
