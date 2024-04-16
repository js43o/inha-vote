type ButtonProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  theme?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'large' | 'medium' | 'small';
  fullWidth?: boolean;
  disabled?: boolean;
};

export function Button({
  text,
  onClick,
  theme = 'primary',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  size = 'large',
  disabled = false,
}: ButtonProps) {
  return (
    <button
      className={`flex ${disabled ? 'cursor-default' : ''} items-center justify-center gap-1 rounded-lg font-semibold leading-tight border: ;
      ${fullWidth ? 'w-full' : ''} ${size === 'large' ? 'p-3' : size === 'medium' ? 'px-3 py-2' : 'py-1 px-2 text-sm'}
      ${
        disabled
          ? 'text-white bg-gray-300 border-gray-300'
          : theme === 'primary'
            ? 'border-gray-800 bg-gray-800 text-white hover:bg-gray-700 active:bg-gray-900'
            : 'border-gray-300 bg-gray-50 text-black hover:bg-white active:bg-gray-100'
      }`}
      onClick={onClick}
    >
      {iconPosition === 'left' ? (
        <>
          {icon}
          {text}
        </>
      ) : (
        <>
          {text}
          {icon}
        </>
      )}
    </button>
  );
}
