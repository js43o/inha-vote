import Check from '~/assets/icons/check.svg?react';

type ToggleInputProps = {
  checked?: boolean;
  text?: string;
  onToggle: () => void;
};

export function ToggleInput({
  checked = false,
  text = '',
  onToggle,
}: ToggleInputProps) {
  return (
    <div
      className={`group flex gap-1.5 items-center cursor-pointer rounded-full ${text ? 'p-1 pr-2.5' : 'p-2'}`}
      onClick={onToggle}
    >
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full
        ${checked ? 'bg-blue-600 group-hover:bg-blue-500 group-active:bg-blue-700' : 'border-2 border-gray-800 bg-white group-hover:border-gray-700 group-active:bg-gray-100 group-active:bg-border-900'}`}
      >
        {checked && <Check width={16} height={16} className="fill-white" />}
      </div>
      {text && <span className="font-semibold">{text}</span>}
    </div>
  );
}
