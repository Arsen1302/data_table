import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { type FC, useEffect, useMemo, useRef } from 'react';

import type { Meta, Unit, UnitsPageResponse, UnitsSort } from '@/api';
import { cn } from '@/utils';

import { buildUnitsColumns } from './UnitsTable.columns';
import { UnitsTableEmpty } from './UnitsTableEmpty';
import { UnitsTableError } from './UnitsTableError';
import { UnitsTableSkeleton } from './UnitsTableSkeleton';
import { UnitsTableSortButton } from './UnitsTableSortButton';

const ROW_HEIGHT = 45;
const LOAD_MORE_OFFSET = 5;

interface UnitsTableProps {
  items: Unit[];
  firstPage: UnitsPageResponse | undefined;
  meta: Meta | undefined;
  isLoading: boolean;
  isError: boolean;
  isRetrying: boolean;
  isRefreshing: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  sort: UnitsSort | undefined;
  onSortChange: (sort: UnitsSort | undefined) => void;
  onRetry: () => void;
  onLoadMore: () => void;
}

export const UnitsTable: FC<UnitsTableProps> = (props) => {
  const {
    items,
    firstPage,
    meta,
    isLoading,
    isError,
    isRetrying,
    isRefreshing,
    hasNextPage,
    isFetchingNextPage,
    sort,
    onSortChange,
    onRetry,
    onLoadMore,
  } = props;

  const scrollRef = useRef<HTMLDivElement>(null);
  const prevFirstPageRef = useRef<UnitsPageResponse | undefined>(undefined);

  const columns = useMemo(() => (meta ? buildUnitsColumns(meta) : []), [meta]);

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 10,
  });

  const virtualRows = virtualizer.getVirtualItems();
  const paddingTop = virtualRows[0]?.start ?? 0;
  const paddingBottom = virtualizer.getTotalSize() - (virtualRows.at(-1)?.end ?? 0);

  useEffect(() => {
    if (firstPage !== prevFirstPageRef.current) {
      prevFirstPageRef.current = firstPage;
      virtualizer.scrollToOffset(0);
      return;
    }
    const lastRow = virtualRows.at(-1);
    const isNearEnd = lastRow !== undefined && lastRow.index >= rows.length - LOAD_MORE_OFFSET;
    if (isNearEnd && hasNextPage && !isFetchingNextPage && !isRefreshing && !isError) {
      onLoadMore();
    }
  }, [
    firstPage,
    virtualRows,
    rows.length,
    hasNextPage,
    isFetchingNextPage,
    isRefreshing,
    isError,
    onLoadMore,
    virtualizer,
  ]);

  if (isError && (items.length === 0 || !meta)) {
    return <UnitsTableError isRetrying={isRetrying} onRetry={onRetry} />;
  }

  if (isLoading || !meta) {
    return <UnitsTableSkeleton />;
  }

  if (items.length === 0) {
    return <UnitsTableEmpty isRefreshing={isRefreshing} />;
  }

  return (
    <div
      ref={scrollRef}
      className={cn(
        'max-h-[70vh] overflow-auto rounded-xl border border-slate-200 transition-opacity dark:border-slate-800',
        isRefreshing && 'opacity-60',
      )}
    >
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-slate-50 text-left text-slate-500 dark:bg-slate-900 dark:text-slate-400">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const { align, sortField } = header.column.columnDef.meta ?? {};
                const sortDir = sortField && sort?.field === sortField ? sort.dir : undefined;

                return (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      sortDir ? (sortDir === 'asc' ? 'ascending' : 'descending') : undefined
                    }
                    className={cn(
                      'px-4 py-3 font-medium whitespace-nowrap',
                      align === 'right' && 'text-right',
                    )}
                  >
                    {sortField ? (
                      <UnitsTableSortButton
                        label={String(header.column.columnDef.header)}
                        field={sortField}
                        sort={sort}
                        onSortChange={onSortChange}
                      />
                    ) : (
                      flexRender(header.column.columnDef.header, header.getContext())
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {paddingTop > 0 && (
            <tr>
              <td style={{ height: paddingTop }} />
            </tr>
          )}
          {virtualRows.map(({ index }) => {
            const row = rows[index];

            return row ? (
              <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50">
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={cn(
                      'px-4 py-3 whitespace-nowrap',
                      cell.column.columnDef.meta?.align === 'right' && 'text-right',
                    )}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ) : null;
          })}

          {paddingBottom > 0 && (
            <tr>
              <td style={{ height: paddingBottom }} />
            </tr>
          )}
        </tbody>
      </table>
      {isFetchingNextPage && (
        <p className="border-t border-slate-100 p-3 text-center text-sm text-slate-500 dark:border-slate-800">
          Загружаем ещё…
        </p>
      )}
      {isError && !isFetchingNextPage && (
        <div className="flex items-center justify-center gap-3 border-t border-slate-100 p-3 text-sm dark:border-slate-800">
          <span className="text-red-600 dark:text-red-400">Не удалось загрузить данные</span>
          <button
            type="button"
            className="font-medium underline hover:text-slate-900 disabled:opacity-60 dark:hover:text-slate-100"
            disabled={isRetrying}
            onClick={onRetry}
          >
            {isRetrying ? 'Повторяем…' : 'Повторить'}
          </button>
        </div>
      )}
      {!hasNextPage && !isError && (
        <p className="border-t border-slate-100 p-3 text-center text-sm text-slate-400 dark:border-slate-800">
          Показаны все юниты
        </p>
      )}
    </div>
  );
};
