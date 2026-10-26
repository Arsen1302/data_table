import type { FC } from 'react';

interface UnitsTableErrorProps {
  isRetrying: boolean;
  onRetry: () => void;
}

export const UnitsTableError: FC<UnitsTableErrorProps> = (props) => {
  const { isRetrying, onRetry } = props;

  return (
    <div className="rounded-xl border border-slate-200 p-12 text-center dark:border-slate-800">
      <p className="font-medium">Не удалось загрузить данные</p>
      <p className="mt-1 text-sm text-slate-500">Проверьте соединение и попробуйте ещё раз</p>
      <button
        type="button"
        className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
        disabled={isRetrying}
        onClick={onRetry}
      >
        {isRetrying ? 'Повторяем…' : 'Повторить'}
      </button>
    </div>
  );
};
