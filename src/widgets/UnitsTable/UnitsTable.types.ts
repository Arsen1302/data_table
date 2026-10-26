import type { RowData } from '@tanstack/react-table';

import type { SortField } from '@/api';

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: 'left' | 'right';
    sortField?: SortField;
  }
}
