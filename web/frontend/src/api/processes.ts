/**
 * API client for Process Management (memory & biocompute processes).
 */

export interface ProcessMeta {
  id: string;
  name: string;
  type: 'memory' | 'biocompute';
  created_at: number;
  public: boolean;
}

export interface ProcessListResponse {
  memory: ProcessMeta[];
  biocompute: ProcessMeta[];
}

export interface SpawnProcessRequest {
  type: 'memory' | 'biocompute';
  name: string;
  public: boolean;
}

export interface SpawnProcessResponse {
  id: string;
}

export interface RefreshResponse {
  status: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json() as Promise<T>;
}

export async function listProcesses(): Promise<ProcessListResponse> {
  return request<ProcessListResponse>('/api/processes');
}

export async function spawnProcess(req: SpawnProcessRequest): Promise<SpawnProcessResponse> {
  return request<SpawnProcessResponse>('/api/processes/spawn', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}

export async function deleteProcess(type: 'memory' | 'biocompute', id: string): Promise<void> {
  await request(`/api/processes/${type}/${id}`, {
    method: 'DELETE',
  });
}

export async function refreshProcessCache(): Promise<RefreshResponse> {
  return request<RefreshResponse>('/api/processes/refresh', {
    method: 'POST',
  });
}