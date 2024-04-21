import Check from '~/assets/icons/check.svg?react';

type CheckCircleProps = {
  checked?: boolean;
};

export function CheckCircle({ checked = false }: CheckCircleProps) {
  return (
    <div>
      <div
        className={`w-5 h-5 flex items-center justify-center rounded-full ${checked ? 'bg-sky-500' : 'border-2 border-gray-800 bg-gray-50'}`}
      >
        {checked && <Check width={16} className="fill-white" />}
      </div>
    </div>
  );
}
