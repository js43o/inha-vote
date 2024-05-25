type ButtonProps = {
  text: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  theme?: 'primary' | 'secondary';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  size?: 'large' | 'medium' | 'small';
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'submit' | 'button';
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
  className,
  type,
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${className} flex border text-nowrap items-center justify-center gap-1 rounded-lg font-semibold leading-tight ${fullWidth ? 'w-full' : ''} ${size === 'large' ? 'p-3' : size === 'medium' ? 'px-3 py-1.5' : 'px-2 py-1 text-sm'} ${
        disabled
          ? 'text-white bg-gray-300 border-gray-300 cursor-default'
          : theme === 'primary'
            ? 'border-transparent bg-blue-600 text-white hover:bg-blue-500 active:bg-blue-700'
            : 'border-gray-300 bg-gray-50 text-black hover:bg-white active:bg-gray-100'
      }`}
      disabled={disabled}
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
