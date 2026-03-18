// Staking API

export interface StakeSummary {
  id: string
  amount: number
  token: string
  startTime: number
  endTime?: number
  rewards?: number
}

export interface StakingDashboardResponse {
  totalStaked: number
  totalRewards: number
  stakes: StakeSummary[]
}

export interface StakeRequest {
  amount: number
  token: string
  duration?: number // optional lock period
}

export interface StakeResponse {
  id: string
  status: string
}

export interface StakeHistoryResponse {
  history: StakeSummary[]
}

export interface RewardsResponse {
  rewards: StakeSummary[]
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

export async function getStakingDashboard(): Promise<StakingDashboardResponse> {
  return request<StakingDashboardResponse>('/api/store/staking/dashboard')
}

export async function stake(req: StakeRequest): Promise<StakeResponse> {
  return request<StakeResponse>('/api/store/staking/stake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })
}

export async function getStakeHistory(): Promise<StakeHistoryResponse> {
  return request<StakeHistoryResponse>('/api/store/staking/history')
}

export async function getRewards(): Promise<RewardsResponse> {
  return request<RewardsResponse>('/api/store/staking/rewards')
}