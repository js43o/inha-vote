import { SelectHTMLAttributes, forwardRef } from 'react';
import { UseFormRegister } from 'react-hook-form';
import { RegisterInput } from '~/libs/types';
import Expand from '~/assets/icons/expand.svg?react';

type SelectProps = {
  label: string;
  grouped?: boolean;
};

export const Select = forwardRef<
  HTMLSelectElement,
  SelectProps &
    SelectHTMLAttributes<HTMLSelectElement> &
    ReturnType<UseFormRegister<RegisterInput>>
>(({ label, grouped, children, disabled, ...props }, ref) => (
  <div
    className={`${grouped ? 'border-b border-gray-300' : 'border border-gray-400 rounded-lg'} relative transition-colors ${disabled ? 'bg-gray-100' : 'bg-white'}`}
  >
    <select
      className={`w-full p-2.5 `}
      disabled={disabled}
      {...props}
      ref={ref}
    >
      {children}
    </select>
    <Expand width={20} height={20} className="absolute z-10 right-3 bottom-3" />
  </div>
));
