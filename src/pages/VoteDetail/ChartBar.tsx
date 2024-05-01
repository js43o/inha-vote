type ChartBarProps = {
  title: string;
  value: number;
  total: number;
  slim?: boolean;
  color?: string;
};

export function ChartBar({
  title,
  value,
  total,
  slim = false,
  color = 'bg-sky-400',
}: ChartBarProps) {
  return (
    <div className={`flex items-center gap-2 ${slim && 'text-sm'}`}>
      <span className="w-16">{title}</span>
      <span className={`flex grow bg-gray-200 ${slim ? 'h-3' : 'h-5'}`}>
        <span
          className={`${color} w-full h-full origin-left`}
          style={{ transform: `scaleX(${(value / total) * 100}%)` }}
        />
      </span>
      <span className="w-16 text-right font-semibold">{value}표</span>
    </div>
  );
}
