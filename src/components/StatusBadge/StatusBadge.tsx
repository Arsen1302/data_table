import { cva } from 'class-variance-authority';
import type { FC } from 'react';

import type { UnitStatus } from '@/api';
import { STATUS_LABELS } from '@/constants';

const badgeVariants = cva('inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium', {
  variants: {
    status: {
      available: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
      reserved: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
      sold: 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
      on_hold: 'bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300',
      unknown: 'bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500',
    },
  },
});

interface StatusBadgeProps {
  status: UnitStatus;
}

export const StatusBadge: FC<StatusBadgeProps> = (props) => {
  const { status } = props;

  return <span className={badgeVariants({ status })}>{STATUS_LABELS[status]}</span>;
};
