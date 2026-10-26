import type { UnitStatus } from '@/api';

export const STATUS_LABELS: Record<UnitStatus, string> = {
  available: 'Свободен',
  reserved: 'Бронь',
  sold: 'Продан',
  on_hold: 'Приостановлен',
  unknown: 'Не указан',
};
