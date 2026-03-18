// Catalog API – product listing, details, and installation

export interface Product {
  id: string
  name: string
  description: string
  type: string          // "Device", "DApp", "Project"
  version?: string
  metadata?: Record<string, any>
}

export interface ProductsResponse {
  products: Product[]
}

export interface ProductDetailResponse extends Product {}

export interface InstallRequest {
  product_id: string
  version?: string
}

export interface InstallResponse {
  status: string
  path: string
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

export async function listProducts(type?: string): Promise<ProductsResponse> {
  const url = type ? `/api/store/products?type=${encodeURIComponent(type)}` : '/api/store/products'
  return request<ProductsResponse>(url)
}

export async function getProduct(id: string): Promise<ProductDetailResponse> {
  return request<ProductDetailResponse>(`/api/store/products/${encodeURIComponent(id)}`)
}

export async function installProduct(req: InstallRequest): Promise<InstallResponse> {
  return request<InstallResponse>('/api/store/install', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}