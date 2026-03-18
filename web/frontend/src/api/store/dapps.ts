// DApps & Projects API

export interface DAppSummary {
  id: string
  name: string
  description: string
  owner?: string
  type: 'dapp' | 'project'
  tokenId?: string
}

export interface DAppDetail extends DAppSummary {
  analytics?: any
  subscriptions?: any[]
  reviews?: Review[]
}

export interface Review {
  id: string
  userId: string
  rating: number
  comment: string
  createdAt: string
}

export interface DAppListResponse {
  dapps: DAppSummary[]
}

export interface DAppDetailResponse extends DAppDetail {}

export interface CreateDAppRequest {
  name: string
  description: string
  type: 'dapp' | 'project'
  tokenId?: string
}

export interface CreateDAppResponse {
  id: string
  status: string
}

export interface SubscribeRequest {
  plan?: string
}

export interface SubscribeResponse {
  status: string
  subscriptionId: string
}

export interface ReviewRequest {
  rating: number
  comment: string
}

export interface ReviewResponse {
  status: string
  reviewId: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(path, options)
  if (!res.ok) {
    let message = `API error: ${res.status} ${res.statusText}`
    try {
      const body = (await res.json()) as {
        error?: string
        errors?: string[]
      }
      if (Array.isArray(body.errors) && body.errors.length > 0) {
        message = body.errors.join('; ')
      } else if (typeof body.error === 'string' && body.error.trim() !== '') {
        message = body.error
      }
    } catch {
      // ignore invalid body
    }
    throw new Error(message)
  }
  return res.json() as Promise<T>
}

// DApp owner endpoints
export async function getDAppOwnerDashboard(): Promise<any> {
  return request<any>('/api/store/dapps/owner/dashboard')
}

export async function createDApp(req: CreateDAppRequest): Promise<CreateDAppResponse> {
  return request<CreateDAppResponse>('/api/store/dapps/owner/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function createSubOwner(req: { ownerId: string }): Promise<any> {
  return request<any>('/api/store/dapps/owner/subowner', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function sendMessageToSubscribers(id: string, message: string): Promise<any> {
  return request<any>(`/api/store/dapps/owner/${encodeURIComponent(id)}/message`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
}

export async function getDAppAnalytics(id: string): Promise<any> {
  return request<any>(`/api/store/dapps/owner/${encodeURIComponent(id)}/analytics`)
}

export async function getDAppReviews(id: string): Promise<{ reviews: Review[] }> {
  return request<{ reviews: Review[] }>(`/api/store/dapps/owner/${encodeURIComponent(id)}/reviews`)
}

export async function getDAppSubscriptions(id: string): Promise<{ subscriptions: any[] }> {
  return request<{ subscriptions: any[] }>(`/api/store/dapps/owner/${encodeURIComponent(id)}/subscriptions`)
}

export async function editDApp(id: string, updates: Partial<CreateDAppRequest>): Promise<any> {
  return request<any>(`/api/store/dapps/owner/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
}

export async function editSubscriptionPlan(id: string, plan: any): Promise<any> {
  return request<any>(`/api/store/dapps/owner/${encodeURIComponent(id)}/subscription-plan`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(plan),
  })
}

// User endpoints for DApps
export async function listUserDApps(): Promise<DAppListResponse> {
  return request<DAppListResponse>('/api/store/dapps/user/list')
}

export async function getUserDAppDetail(id: string): Promise<DAppDetailResponse> {
  return request<DAppDetailResponse>(`/api/store/dapps/user/${encodeURIComponent(id)}`)
}

export async function subscribeToDApp(id: string, req?: SubscribeRequest): Promise<SubscribeResponse> {
  return request<SubscribeResponse>(`/api/store/dapps/user/${encodeURIComponent(id)}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req || {}),
  })
}

export async function reviewDApp(id: string, req: ReviewRequest): Promise<ReviewResponse> {
  return request<ReviewResponse>(`/api/store/dapps/user/${encodeURIComponent(id)}/review`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function getUserDAppAnalytics(id: string): Promise<any> {
  return request<any>(`/api/store/dapps/user/${encodeURIComponent(id)}/analytics`)
}

export async function getUserMessages(): Promise<{ messages: any[] }> {
  return request<{ messages: any[] }>('/api/store/dapps/user/messages')
}

export async function getUserMessageInfo(id: string): Promise<any> {
  return request<any>(`/api/store/dapps/user/messages/${encodeURIComponent(id)}`)
}