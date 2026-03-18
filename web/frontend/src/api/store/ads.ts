// Advertising API – for advertisers, dapp owners, and traders

export interface AdSummary {
  id: string
  title: string
  status: string
  impressions: number
  clicks: number
  budget: number
  // ... other fields
}

export interface AdDetail extends AdSummary {
  // full details
  targetUrl?: string
  startDate?: string
  endDate?: string
}

export interface AdListResponse {
  ads: AdSummary[]
}

export interface AdDetailResponse extends AdDetail {}

export interface CreateAdRequest {
  title: string
  content: string
  budget: number
  // ... other fields
}

export interface CreateAdResponse {
  id: string
  status: string
}

export interface UpdateAdRequest {
  title?: string
  content?: string
  budget?: number
}

export interface UpdateAdResponse {
  status: string
  id: string
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

// Advertiser endpoints
export async function getAdvertiserDashboard(): Promise<any> {
  return request<any>('/api/store/ads/advertiser/dashboard')
}

export async function createPersonalAd(req: CreateAdRequest): Promise<CreateAdResponse> {
  return request<CreateAdResponse>('/api/store/ads/advertiser/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function listPersonalAds(): Promise<AdListResponse> {
  return request<AdListResponse>('/api/store/ads/advertiser/list')
}

export async function updatePersonalAd(id: string, req: UpdateAdRequest): Promise<UpdateAdResponse> {
  return request<UpdateAdResponse>(`/api/store/ads/advertiser/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function deletePersonalAd(id: string): Promise<void> {
  await request<void>(`/api/store/ads/advertiser/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

// DApp owner advertising endpoints
export async function getDAppOwnerAdsDashboard(): Promise<any> {
  return request<any>('/api/store/ads/dapp-owner/dashboard')
}

export async function createBusinessAd(req: CreateAdRequest): Promise<CreateAdResponse> {
  return request<CreateAdResponse>('/api/store/ads/dapp-owner/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function listBusinessAds(): Promise<AdListResponse> {
  return request<AdListResponse>('/api/store/ads/dapp-owner/list')
}

export async function updateBusinessAd(id: string, req: UpdateAdRequest): Promise<UpdateAdResponse> {
  return request<UpdateAdResponse>(`/api/store/ads/dapp-owner/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function deleteBusinessAd(id: string): Promise<void> {
  await request<void>(`/api/store/ads/dapp-owner/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}

// Trader endpoints
export async function getTraderDashboard(): Promise<any> {
  return request<any>('/api/store/ads/trader/dashboard')
}

export async function listAdMarketplace(): Promise<AdListResponse> {
  return request<AdListResponse>('/api/store/ads/marketplace')
}

export async function getAdMarketplaceInfo(id: string): Promise<AdDetailResponse> {
  return request<AdDetailResponse>(`/api/store/ads/marketplace/${encodeURIComponent(id)}`)
}

export async function editAdForTrade(id: string, req: UpdateAdRequest): Promise<UpdateAdResponse> {
  return request<UpdateAdResponse>(`/api/store/ads/marketplace/${encodeURIComponent(id)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function delistAd(id: string): Promise<void> {
  await request<void>(`/api/store/ads/marketplace/${encodeURIComponent(id)}`, {
    method: 'DELETE',
  })
}