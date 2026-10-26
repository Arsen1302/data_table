import { useQuery } from '@tanstack/react-query';
import { getRouteApi, Link } from '@tanstack/react-router';

import { ApiError, metaQueryOptions, unitQueryOptions } from '@/api';
import { StatusBadge } from '@/components';
import { formatDate, formatPrice, formatRooms } from '@/utils';

const route = getRouteApi('/units/$id');

const backLinkClassName =
  'text-sm text-slate-500 underline-offset-2 hover:text-slate-900 hover:underline dark:hover:text-slate-100';

export const UnitDetailsPage = () => {
  const { id } = route.useParams();
  const meta = useQuery(metaQueryOptions);
  const unit = useQuery(unitQueryOptions(id));

  const isNotFound = unit.error instanceof ApiError && unit.error.status === 404;
  const isError = meta.isError || (unit.isError && !isNotFound);
  const isLoading = unit.isPending || meta.isPending;
  const isRetrying = isError && (unit.isFetching || meta.isFetching);

  const handleRetry = () => {
    if (unit.isError) unit.refetch();
    if (meta.isError) meta.refetch();
  };

  if (isNotFound) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <Link to="/" className={backLinkClassName}>
          ← К списку юнитов
        </Link>
        <div className="mt-4 rounded-xl border border-slate-200 p-12 text-center dark:border-slate-800">
          <p className="font-medium">Юнит не найден</p>
          <p className="mt-1 text-sm text-slate-500">
            Возможно, ссылка устарела или юнит был удалён
          </p>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <Link to="/" className={backLinkClassName}>
          ← К списку юнитов
        </Link>
        <div className="mt-4 rounded-xl border border-slate-200 p-12 text-center dark:border-slate-800">
          <p className="font-medium">Не удалось загрузить данные</p>
          <p className="mt-1 text-sm text-slate-500">Проверьте соединение и попробуйте ещё раз</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            disabled={isRetrying}
            onClick={handleRetry}
          >
            {isRetrying ? 'Повторяем…' : 'Повторить'}
          </button>
        </div>
      </main>
    );
  }

  if (isLoading || !unit.data || !meta.data) {
    return (
      <main className="mx-auto max-w-2xl p-6">
        <div className="h-4 w-32 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
          <div className="h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          <div className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4">
            <div className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
            <div className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
            <div className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
            <div className="h-10 animate-pulse rounded bg-slate-100 dark:bg-slate-900" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <Link to="/" className={backLinkClassName}>
        ← К списку юнитов
      </Link>
      <div className="mt-4 rounded-xl border border-slate-200 p-6 dark:border-slate-800">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">{unit.data.title}</h1>
          <StatusBadge status={unit.data.status} />
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <dt className="text-slate-500">Корпус</dt>
            <dd className="mt-0.5 font-medium">{unit.data.building}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Площадь</dt>
            <dd className="mt-0.5 font-medium">{unit.data.area.toLocaleString('ru-RU')} м²</dd>
          </div>
          <div>
            <dt className="text-slate-500">Комнаты</dt>
            <dd className="mt-0.5 font-medium">{formatRooms(unit.data.rooms)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Этаж</dt>
            <dd className="mt-0.5 font-medium">{unit.data.floor}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Цена</dt>
            <dd className="mt-0.5 font-medium">
              {formatPrice(unit.data.price, meta.data.priceMinorUnits, meta.data.currency)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Добавлен</dt>
            <dd className="mt-0.5 font-medium">{formatDate(unit.data.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </main>
  );
};
