import { SelectHTMLAttributes, forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterInput } from '~/lib/types';
import Expand from '~/assets/icons/expand.svg?react';

type SelectProps = {
  label?: string;
};

export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps &
    SelectHTMLAttributes<HTMLSelectElement> &
    ReturnType<UseFormRegister<RegisterInput>>
>(({ onChange, onBlur, name, label, children, ...props }, ref) => (
  <label className="flex flex-col gap-1 text-gray-500 relative">
    {label}
    <select
      className={`border rounded-md p-2.5 text-black focus:border-gray-800 border-gray-400`}
      name={name}
      onChange={onChange}
      onBlur={onBlur}
      {...props}
      ref={ref}
    >
      {children}
    </select>
    <Expand width={20} height={20} className="absolute right-3 bottom-3" />
  </label>
));
