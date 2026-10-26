import type { FC } from 'react';

import type { SortField, UnitsSort } from '@/api';
import { Icon } from '@/components';
import { cn } from '@/utils';

interface UnitsTableSortButtonProps {
  label: string;
  field: SortField;
  sort: UnitsSort | undefined;
  onSortChange: (sort: UnitsSort | undefined) => void;
}

const inactiveCaretClassName = 'text-slate-300 dark:text-slate-600';
const activeCaretClassName = 'text-slate-900 dark:text-white';

export const UnitsTableSortButton: FC<UnitsTableSortButtonProps> = (props) => {
  const { label, field, sort, onSortChange } = props;

  const dir = sort?.field === field ? sort.dir : undefined;

  const handleClick = () => {
    if (dir === undefined) {
      onSortChange({ field, dir: 'asc' });
      return;
    }
    if (dir === 'asc') {
      onSortChange({ field, dir: 'desc' });
      return;
    }
    onSortChange(undefined);
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-slate-100',
        dir && 'text-slate-900 dark:text-slate-100',
      )}
      onClick={handleClick}
    >
      {label}
      <span className="inline-flex flex-col" aria-hidden>
        <Icon
          name="caret-up"
          size={8}
          className={dir === 'asc' ? activeCaretClassName : inactiveCaretClassName}
        />
        <Icon
          name="caret-down"
          size={8}
          className={dir === 'desc' ? activeCaretClassName : inactiveCaretClassName}
        />
      </span>
    </button>
  );
};
