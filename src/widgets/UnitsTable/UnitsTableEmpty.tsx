import type { FC } from 'react';

import { cn } from '@/utils';

interface UnitsTableEmptyProps {
  isRefreshing: boolean;
}

export const UnitsTableEmpty: FC<UnitsTableEmptyProps> = (props) => {
  const { isRefreshing } = props;

  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 p-12 text-center transition-opacity dark:border-slate-800',
        isRefreshing && 'opacity-60',
      )}
    >
      <p className="font-medium">{isRefreshing ? 'Обновляем результаты…' : 'Ничего не найдено'}</p>
      <p className="mt-1 text-sm text-slate-500">Попробуйте изменить или сбросить фильтры</p>
    </div>
  );
};
