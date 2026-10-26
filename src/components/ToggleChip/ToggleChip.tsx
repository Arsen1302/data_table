import { cn } from '@/utils';

interface ToggleChipProps<T extends string | number> {
  value: T;
  label: string;
  isActive: boolean;
  onToggle: (value: T) => void;
}

export const ToggleChip = <T extends string | number>(props: ToggleChipProps<T>) => {
  const { value, label, isActive, onToggle } = props;

  const handleClick = () => {
    onToggle(value);
  };

  return (
    <button
      type="button"
      className={cn(
        'rounded-full border px-3 py-1 text-sm',
        isActive
          ? 'border-slate-900 bg-slate-900 text-white dark:border-white dark:bg-white dark:text-slate-900'
          : 'border-slate-300 text-slate-600 hover:border-slate-400 dark:border-slate-700 dark:text-slate-300',
      )}
      onClick={handleClick}
    >
      {label}
    </button>
  );
};
