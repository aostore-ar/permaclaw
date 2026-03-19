/**
 * API client for Permanent Memory (AO processes).
 */

export interface MemoryMetadata {
  id: string;
  timestamp: number;
  type: string;
  importance: number;
}

export interface Memory {
  id: string;
  content: string;
  type: string;
  importance: number;
  timestamp: number;
}

export interface StoreMemoryRequest {
  process_id: string;
  content: string;
  type: string;
  importance: number;
}

export interface StoreMemoryResponse {
  id: string;
}

export interface ListMemoriesResponse {
  memories: MemoryMetadata[];
}

export interface RecoverRequest {
  process_id?: string;   // optional, falls back to config
}

export interface RecoverResponse {
  status: string;
  count?: number;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function storeMemory(req: StoreMemoryRequest): Promise<StoreMemoryResponse> {
  return request<StoreMemoryResponse>('/api/memory/store', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}

export async function listMemories(processId: string): Promise<MemoryMetadata[]> {
  const resp = await request<ListMemoriesResponse>(`/api/memory/list?process=${encodeURIComponent(processId)}`);
  return resp.memories;
}

export async function getMemory(processId: string, memoryId: string): Promise<Memory> {
  return request<Memory>(`/api/memory/${memoryId}?process=${encodeURIComponent(processId)}`);
}

export async function recoverMemory(req: RecoverRequest): Promise<RecoverResponse> {
  return request<RecoverResponse>('/api/memory/recover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}