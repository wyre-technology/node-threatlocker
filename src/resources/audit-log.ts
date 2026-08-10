import type { HttpClient } from '../http.js';
import type { AuditLogEntry, AuditLogSearchParams, PaginatedResponse } from '../types/index.js';
import { unwrapPaginatedResponse } from '../pagination.js';

const DAY_MS = 24 * 60 * 60 * 1000;

function toIsoSeconds(value: string | Date): string {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid audit log date "${String(value)}" — use an ISO 8601 timestamp.`);
  }
  return d.toISOString().replace(/\.\d{3}Z$/, 'Z');
}

export class AuditLogResource {
  constructor(private readonly http: HttpClient) {}

  async search(params: AuditLogSearchParams = {}): Promise<PaginatedResponse<AuditLogEntry>> {
    // ActionLogGetByParametersV2 contract (threatlocker.kb.help/unified-audit-
    // portalapiactionlog): startDate/endDate and paramsFieldsDto are REQUIRED
    // (omitting dates is HTTP 417 "Invalid Date Range"), and the request must
    // carry a `usenewsearch: true` header. Defaults to the last 24 hours.
    const endDate = toIsoSeconds(params.endDate ?? params.toDate ?? new Date());
    const startDate = toIsoSeconds(
      params.startDate ?? params.fromDate ?? new Date(new Date(endDate).getTime() - DAY_MS),
    );
    const body: Record<string, unknown> = {
      startDate,
      endDate,
      pageNumber: params.pageNumber ?? 1,
      pageSize: params.pageSize ?? 25,
      paramsFieldsDto: [],
      showChildOrganizations: params.childOrganizations ?? false,
    };
    if (params.searchText) body.fullPath = params.searchText;
    if (params.actionType) body.actionType = params.actionType;
    if (params.hostname) body.hostname = params.hostname;

    const { data, pagination } = await this.http.requestWithMeta<any>('/ActionLog/ActionLogGetByParametersV2', {
      method: 'POST',
      body,
      headers: { usenewsearch: 'true' },
    });
    return unwrapPaginatedResponse<AuditLogEntry>(data, params.pageNumber ?? 1, params.pageSize ?? 25, pagination);
  }

  async get(id: number): Promise<AuditLogEntry> {
    return this.http.request<AuditLogEntry>('/ActionLog/ActionLogGetByIdV2', {
      params: { actionLogId: id },
    });
  }

  async getFileHistory(fullPath: string): Promise<AuditLogEntry[]> {
    const response = await this.http.request<{ logs?: AuditLogEntry[] }>('/ActionLog/ActionLogGetAllForFileHistoryV2', {
      params: { fullPath },
    });
    return response.logs || [];
  }
}
