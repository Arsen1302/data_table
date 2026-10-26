import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';

import { metaQueryOptions, type UnitsSort, unitsInfiniteQueryOptions } from '@/api';
import { SearchInput } from '@/components';
import { uniqueById } from '@/utils';
import { UnitsFilters, UnitsTable } from '@/widgets';

import type { UnitsSearch } from './UnitsPage.validation';

const route = getRouteApi('/');

export const UnitsPage = () => {
  const search = route.useSearch();
  const navigate = route.useNavigate();
  const meta = useQuery(metaQueryOptions);
  const units = useInfiniteQuery(
    unitsInfiniteQueryOptions({
      search: search.search,
      rooms: search.rooms,
      status: search.status,
      priceMin: search.priceMin,
      priceMax: search.priceMax,
      sort: search.sortBy ? { field: search.sortBy, dir: search.sortDir ?? 'asc' } : undefined,
    }),
  );

  const items = useMemo(
    () => uniqueById(units.data?.pages.flatMap((page) => page.items) ?? []),
    [units.data],
  );

  const total = units.data?.pages[0]?.total ?? 0;
  const isError = units.isError || meta.isError;
  const showTotal = units.isSuccess && meta.isSuccess && !units.isPlaceholderData;
  const sort = search.sortBy ? { field: search.sortBy, dir: search.sortDir ?? 'asc' } : undefined;

  const handleRetry = () => {
    if (meta.isError) meta.refetch();
    if (units.isError) units.refetch();
  };

  const handleLoadMore = () => {
    units.fetchNextPage();
  };

  const handleFiltersChange = (patch: Partial<UnitsSearch>) => {
    navigate({ search: (prev) => ({ ...prev, ...patch }) });
  };

  const handleSearchChange = (value: string) => {
    navigate({ search: (prev) => ({ ...prev, search: value || undefined }), replace: true });
  };

  const handleSortChange = (next: UnitsSort | undefined) => {
    navigate({ search: (prev) => ({ ...prev, sortBy: next?.field, sortDir: next?.dir }) });
  };

  return (
    <main className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Юниты</h1>
        {showTotal && (
          <p className="text-sm text-slate-500">Найдено: {total.toLocaleString('ru-RU')}</p>
        )}
      </header>
      <div className="mb-4">
        <SearchInput
          value={search.search ?? ''}
          placeholder="Поиск по названию юнита"
          isBusy={units.isPlaceholderData && Boolean(search.search)}
          onChange={handleSearchChange}
        />
      </div>
      {meta.data && (
        <UnitsFilters meta={meta.data} search={search} onChange={handleFiltersChange} />
      )}
      <UnitsTable
        items={items}
        firstPage={units.data?.pages[0]}
        meta={meta.data}
        isLoading={units.isPending || meta.isPending}
        isError={isError}
        isRetrying={isError && (units.isFetching || meta.isFetching)}
        isRefreshing={units.isPlaceholderData}
        hasNextPage={units.hasNextPage}
        isFetchingNextPage={units.isFetchingNextPage}
        sort={sort}
        onSortChange={handleSortChange}
        onRetry={handleRetry}
        onLoadMore={handleLoadMore}
      />
    </main>
  );
};
