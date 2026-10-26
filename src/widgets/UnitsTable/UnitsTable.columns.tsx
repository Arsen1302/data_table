import { Link } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';

import type { Meta, Unit } from '@/api';
import { StatusBadge } from '@/components';
import { formatPrice, formatRooms } from '@/utils';
import './UnitsTable.types';

const columnHelper = createColumnHelper<Unit>();

export const buildUnitsColumns = (meta: Meta) => [
  columnHelper.accessor('title', {
    header: 'Юнит',
    cell: (cell) => (
      <Link
        to="/units/$id"
        params={{ id: cell.row.original.id }}
        className="font-medium text-slate-900 underline-offset-2 hover:underline dark:text-slate-100"
      >
        {cell.getValue()}
      </Link>
    ),
  }),
  columnHelper.accessor('building', { header: 'Корпус' }),
  columnHelper.accessor('area', {
    header: 'Площадь',
    meta: { align: 'right', sortField: 'area' },
    cell: (cell) => `${cell.getValue().toLocaleString('ru-RU')} м²`,
  }),
  columnHelper.accessor('rooms', {
    header: 'Комнаты',
    meta: { align: 'right', sortField: 'rooms' },
    cell: (cell) => formatRooms(cell.getValue()),
  }),
  columnHelper.accessor('floor', {
    header: 'Этаж',
    meta: { align: 'right', sortField: 'floor' },
  }),
  columnHelper.accessor('price', {
    header: 'Цена',
    meta: { align: 'right', sortField: 'price' },
    cell: (cell) => formatPrice(cell.getValue(), meta.priceMinorUnits, meta.currency),
  }),
  columnHelper.accessor('status', {
    header: 'Статус',
    cell: (cell) => <StatusBadge status={cell.getValue()} />,
  }),
];
