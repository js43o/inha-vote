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
      onChange,
      onBlur,
      ...props
    },
    ref,
  ) =>
    grouped ? (
      <input
        className={`${error ? 'bg-red-100' : 'bg-white'} border-b border-gray-300 min-w-0 w-full p-2.5 ${className}`}
        placeholder={label}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
        ref={ref}
      />
    ) : (
      <input
        className={`${error ? 'bg-red-100 border-red-500' : 'bg-white'} border border-gray-400 rounded-lg min-w-0 w-full p-2.5 ${className}`}
        placeholder={label}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
        ref={ref}
      />
    ),
);
