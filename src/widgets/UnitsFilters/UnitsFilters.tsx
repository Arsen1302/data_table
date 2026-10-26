import type { FC } from 'react';

import { KNOWN_UNIT_STATUSES, type KnownUnitStatus, type Meta } from '@/api';
import { NumberRangeInput, ToggleChip } from '@/components';
import { STATUS_LABELS } from '@/constants';
import type { UnitsSearch } from '@/pages/Units/UnitsPage.validation';
import { formatRooms } from '@/utils';

interface UnitsFiltersProps {
  meta: Meta;
  search: UnitsSearch;
  onChange: (patch: Partial<UnitsSearch>) => void;
}

export const UnitsFilters: FC<UnitsFiltersProps> = (props) => {
  const { meta, search, onChange } = props;

  const statusOptions = KNOWN_UNIT_STATUSES.filter(
    (status) => meta.statuses.includes(status) || Boolean(search.status?.includes(status)),
  );
  const toRubles = (minor?: number) =>
    minor !== undefined ? minor / meta.priceMinorUnits : undefined;
  const hasActiveFilters =
    search.priceMin !== undefined ||
    search.priceMax !== undefined ||
    Boolean(search.rooms?.length) ||
    Boolean(search.status?.length) ||
    Boolean(search.search);

  const handlePriceChange = (range: { min?: number; max?: number }) => {
    onChange({
      priceMin: range.min !== undefined ? Math.round(range.min * meta.priceMinorUnits) : undefined,
      priceMax: range.max !== undefined ? Math.round(range.max * meta.priceMinorUnits) : undefined,
    });
  };

  const handleRoomToggle = (room: number) => {
    const current = search.rooms ?? [];
    const next = current.includes(room)
      ? current.filter((value) => value !== room)
      : [...current, room];
    onChange({ rooms: next.length ? next : undefined });
  };

  const handleStatusToggle = (status: KnownUnitStatus) => {
    const current = search.status ?? [];
    const next = current.includes(status)
      ? current.filter((value) => value !== status)
      : [...current, status];
    onChange({ status: next.length ? next : undefined });
  };

  const handleReset = () => {
    onChange({
      priceMin: undefined,
      priceMax: undefined,
      rooms: undefined,
      status: undefined,
      search: undefined,
    });
  };

  return (
    <section className="mb-6 flex flex-wrap items-end gap-x-8 gap-y-4">
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">Цена, ₽</p>
        <NumberRangeInput
          value={{ min: toRubles(search.priceMin), max: toRubles(search.priceMax) }}
          placeholder={{ min: toRubles(meta.priceRange.min), max: toRubles(meta.priceRange.max) }}
          onChange={handlePriceChange}
        />
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">Комнаты</p>
        <div className="flex flex-wrap gap-1.5">
          {meta.rooms.map((room) => (
            <ToggleChip
              key={room}
              value={room}
              label={formatRooms(room)}
              isActive={Boolean(search.rooms?.includes(room))}
              onToggle={handleRoomToggle}
            />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-medium text-slate-500">Статус</p>
        <div className="flex flex-wrap gap-1.5">
          {statusOptions.map((status) => (
            <ToggleChip
              key={status}
              value={status}
              label={STATUS_LABELS[status]}
              isActive={Boolean(search.status?.includes(status))}
              onToggle={handleStatusToggle}
            />
          ))}
        </div>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          className="rounded-lg px-3 py-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
          onClick={handleReset}
        >
          Сбросить
        </button>
      )}
    </section>
  );
};
