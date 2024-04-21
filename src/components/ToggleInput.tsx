import Check from '~/assets/icons/check.svg?react';

type ToggleInputProps = {
  checked?: boolean;
  text: string;
};

export function ToggleInput({ checked = false, text }: ToggleInputProps) {
  return (
    <div className="group flex gap-1.5 items-center">
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full
        ${checked ? 'bg-sky-500 group-hover:bg-sky-400 group-active:bg-sky-600' : 'border-2 border-gray-800 bg-gray-50 group-hover:bg-gray-100 group-active:bg-gray-200'}`}
      >
        {checked && <Check width={16} height={16} className="fill-white" />}
      </div>
      <span className="font-semibold">{text}</span>
    </div>
  );
}
