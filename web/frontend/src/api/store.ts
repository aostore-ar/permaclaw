/**
 * API client for aoStore – DApps, Products, and Ads.
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  sub_category?: string;
  logo_url?: string;
  website_url?: string;
  product_type: 'Website DApp' | 'Mobile DApp' | 'Device' | 'Project';
  blockchain?: string;
  referral_fee?: number;          // for DApps/Devices
  token_id?: string;               // for Projects
  owner?: string;
  rating?: number;
  reviews_count?: number;
  timestamp?: number;              // creation timestamp
}

export interface ProductListResponse {
  products: Product[];
}

export interface ProductDetailResponse extends Product {}

export interface InstallRequest {
  product_id: string;
  version?: string;
}

export interface InstallResponse {
  status: string;
  path?: string;
}

// Ads
export interface Ad {
  id: string;
  title: string;
  description: string;
  target_url: string;
  image_url?: string;
  category: string;
  ad_type: 'personal' | 'business';
  payment_model: 'PPV' | 'PPC';
  payment_token: string;
  total_amount: number;
  net_amount: number;
  target_views: number;
  remaining_views: number;
  impressions: number;
  clicks: number;
  ctr?: number;
  status: 'active' | 'paused' | 'completed';
  created_at: number;
  business_id?: string;            // for business ads
}

export interface CreateAdRequest {
  ad_type: 'personal' | 'business';
  business_id?: string;
  title: string;
  description: string;
  target_url: string;
  image_url?: string;
  category: string;
  payment_model: 'PPV' | 'PPC';
  payment_token: string;
  total_amount: number;
  target_views: number;
}

export interface AdListResponse {
  ads: Ad[];
}

export interface AdDetailResponse extends Ad {}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json() as Promise<T>;
}

// ----- Product endpoints -----

export async function listProducts(type?: string): Promise<Product[]> {
  const url = type ? `/api/store/products?type=${encodeURIComponent(type)}` : '/api/store/products';
  const resp = await request<ProductListResponse>(url);
  return resp.products;
}

export async function getProduct(id: string): Promise<Product> {
  return request<ProductDetailResponse>(`/api/store/products/${id}`);
}

export async function createProduct(data: Partial<Product>): Promise<{ id: string }> {
  return request<{ id: string }>('/api/store/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function installProduct(req: InstallRequest): Promise<InstallResponse> {
  return request<InstallResponse>('/api/store/install', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}

// ----- Ads endpoints -----

export async function listUserAds(): Promise<Ad[]> {
  const resp = await request<AdListResponse>('/api/ads');
  return resp.ads;
}

export async function getAd(id: string): Promise<Ad> {
  return request<AdDetailResponse>(`/api/ads/${id}`);
}

export async function createAd(data: CreateAdRequest): Promise<{ id: string }> {
  return request<{ id: string }>('/api/ads', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function updateAd(id: string, data: Partial<Ad>): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/ads/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export async function deleteAd(id: string): Promise<{ success: boolean }> {
  return request<{ success: boolean }>(`/api/ads/${id}`, {
    method: 'DELETE',
  });
}

// Ad performance / analytics
export interface AdPerformance {
  id: string;
  impressions: number;
  clicks: number;
  ctr: number;
  spend: number;
  remaining_views: number;
}

export async function getAdPerformance(id: string): Promise<AdPerformance> {
  return request<AdPerformance>(`/api/ads/${id}/performance`);
}