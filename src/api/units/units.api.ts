import { infiniteQueryOptions, keepPreviousData, queryOptions } from '@tanstack/react-query';

import api from '../config/instance';
import { ApiError } from '../config/interceptors';

import {
  type Meta,
  metaSchema,
  type Unit,
  type UnitsFilter,
  type UnitsPageResponse,
  unitSchema,
  unitsResponseSchema,
} from './units.types';

export const PAGE_SIZE = 50;

const buildUnitsParams = (filter: UnitsFilter, page: number) => ({
  page,
  pageSize: PAGE_SIZE,
  sort: filter.sort ? `${filter.sort.field}:${filter.sort.dir}` : undefined,
  priceMin: filter.priceMin,
  priceMax: filter.priceMax,
  rooms: filter.rooms?.length ? filter.rooms.join(',') : undefined,
  status: filter.status?.length ? filter.status.join(',') : undefined,
  search: filter.search || undefined,
});

export const unitsApi = {
  getUnits: async (
    filter: UnitsFilter,
    page: number,
    signal?: AbortSignal,
  ): Promise<UnitsPageResponse> => {
    const response = await api.get('/api/units', {
      params: buildUnitsParams(filter, page),
      signal,
    });
    const { items } = unitsResponseSchema.parse(response.data);
    const total = Number(response.headers['x-total-count']) || items.length;
    return { items, total };
  },
  getUnit: async (id: string, signal?: AbortSignal): Promise<Unit> => {
    const response = await api.get(`/api/units/${id}`, { signal });
    return unitSchema.parse(response.data);
  },
  getMeta: async (signal?: AbortSignal): Promise<Meta> => {
    const response = await api.get('/api/meta', { signal });
    return metaSchema.parse(response.data);
  },
};

export const unitQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['units', 'detail', id],
    queryFn: ({ signal }) => unitsApi.getUnit(id, signal),
    retry: (failureCount, error) => {
      const isNotFound = error instanceof ApiError && error.status === 404;
      return !isNotFound && failureCount < 1;
    },
  });

export const unitsInfiniteQueryOptions = (filter: UnitsFilter) =>
  infiniteQueryOptions({
    queryKey: ['units', 'list', filter],
    queryFn: ({ pageParam, signal }) => unitsApi.getUnits(filter, pageParam, signal),
    initialPageParam: 1,
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      const loaded = allPages.reduce((count, p) => count + p.items.length, 0);
      const hasMore = lastPage.items.length > 0 && loaded < lastPage.total;
      return hasMore ? lastPageParam + 1 : undefined;
    },
  });

export const metaQueryOptions = queryOptions({
  queryKey: ['units', 'meta'],
  queryFn: ({ signal }) => unitsApi.getMeta(signal),
  staleTime: Infinity,
});
