import type { PaginatedResponse } from './types/index.js';
import type { PaginationMeta } from './http.js';

export interface ThreatLockerResponse {
  totalItems?: number;
  items?: unknown[];
  // ThreatLocker may use different property names
  data?: unknown[];
  results?: unknown[];
}

/**
 * portalapi list endpoints return a BARE JSON ARRAY as the body and put the
 * totals in a `pagination` response header (live-verified 2026-08-10).
 * Object-wrapped shapes are kept as a defensive fallback.
 */
export function unwrapPaginatedResponse<T>(
  response: ThreatLockerResponse | T[],
  pageNumber: number,
  pageSize: number,
  meta?: PaginationMeta,
): PaginatedResponse<T> {
  const items = Array.isArray(response)
    ? response
    : ((response.items || response.data || response.results || []) as T[]);
  const total =
    meta?.totalItems ?? (Array.isArray(response) ? items.length : response.totalItems || 0);
  const hasMore =
    meta?.totalPages !== undefined && meta?.currentPage !== undefined
      ? meta.currentPage < meta.totalPages
      : pageNumber * pageSize < total;

  return {
    items: items as T[],
    page: pageNumber,
    pageSize,
    total,
    hasMore,
  };
}
