import { z } from 'zod';

import { KNOWN_UNIT_STATUSES, SORT_FIELDS } from '@/api';

export const unitsSearchSchema = z.object({
  search: z.string().optional().catch(undefined),
  rooms: z.number().int().nonnegative().array().optional().catch(undefined),
  status: z.enum(KNOWN_UNIT_STATUSES).array().optional().catch(undefined),
  priceMin: z.number().int().nonnegative().optional().catch(undefined),
  priceMax: z.number().int().nonnegative().optional().catch(undefined),
  sortBy: z.enum(SORT_FIELDS).optional().catch(undefined),
  sortDir: z.enum(['asc', 'desc']).optional().catch(undefined),
});

export type UnitsSearch = z.infer<typeof unitsSearchSchema>;
