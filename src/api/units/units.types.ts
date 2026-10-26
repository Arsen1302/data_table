import { z } from 'zod';

export const KNOWN_UNIT_STATUSES = ['available', 'reserved', 'sold', 'on_hold'] as const;

export type KnownUnitStatus = (typeof KNOWN_UNIT_STATUSES)[number];

export type UnitStatus = KnownUnitStatus | 'unknown';

export const isKnownStatus = (value: string): value is KnownUnitStatus =>
  (KNOWN_UNIT_STATUSES as readonly string[]).includes(value);

const unitStatusSchema = z
  .string()
  .nullish()
  .transform((value): UnitStatus => (value != null && isKnownStatus(value) ? value : 'unknown'));

export const unitSchema = z.object({
  id: z.string(),
  title: z.string(),
  building: z.string(),
  area: z.number(),
  rooms: z.number().int().nonnegative(),
  floor: z.number().int(),
  price: z.number().int().nonnegative(),
  status: unitStatusSchema,
  createdAt: z.string(),
});

export type Unit = z.infer<typeof unitSchema>;

export const unitsResponseSchema = z.object({
  items: z.array(unitSchema),
});

export const metaSchema = z.object({
  statuses: z.array(z.string()),
  rooms: z.array(z.number().int()),
  priceRange: z.object({ min: z.number(), max: z.number() }),
  currency: z.string(),
  priceMinorUnits: z.number().int().positive(),
});

export type Meta = z.infer<typeof metaSchema>;

export const SORT_FIELDS = ['price', 'area', 'floor', 'rooms', 'createdAt'] as const;

export type SortField = (typeof SORT_FIELDS)[number];

export type SortDir = 'asc' | 'desc';

export interface UnitsSort {
  field: SortField;
  dir: SortDir;
}

export interface UnitsFilter {
  priceMin?: number;
  priceMax?: number;
  rooms?: number[];
  status?: UnitStatus[];
  search?: string;
  sort?: UnitsSort;
}

export interface UnitsPageResponse {
  items: Unit[];
  total: number;
}
