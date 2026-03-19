/**
 * API client for Staking (global and user).
 */

export interface PlatformStats {
  total_staked: number;
  total_rewards: number;
  active_stakers: number;
  current_epoch: number;
  staked_growth: number;
  rewards_growth: number;
  stakers_growth: number;
  average_apy: number;
  platform_fee: number;
  avg_staking_duration: number;
  weekly_new_stakers: number;
  weekly_volume: number;
  weekly_rewards: number;
}

export interface EpochRewards {
  [tokenId: string]: number;
  epoch_progress: number;
  time_remaining: number;
  next_distribution: number;
}

export interface TokenDistribution {
  [tokenId: string]: {
    percentage: number;
    amount: number;
  };
}

export interface TopStaker {
  address: string;
  amount: number;
}

export interface ActivityItem {
  type: string;
  user?: string;
  amount: number;
  token?: string;
  time_ago?: string;
  timestamp: number;
}

export interface UserStake {
  amount: number;
  staked_at: number;
  lock_period: number;
  penalty: number;
  unlock_time: number;
}

export interface UserStats {
  total_staked: number;
  available_rewards: number;
  days_remaining: number;
  current_penalty: number;
}

export interface AvailableRewards {
  [tokenId: string]: number;
}

export interface RewardsHistoryItem {
  type: string;
  amount: number;
  token_id: string;
  timestamp: number;
}

export interface UserRewardsStats {
  total_earned: number;
  total_withdrawn: number;
  pending_rewards: number;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${res.statusText} – ${text}`);
  }
  return res.json() as Promise<T>;
}

// ----- Global endpoints -----

export async function getPlatformStats(): Promise<PlatformStats> {
  return request<PlatformStats>('/api/staking/platform-stats');
}

export async function getEpochRewards(): Promise<EpochRewards> {
  return request<EpochRewards>('/api/staking/epoch-rewards');
}

export async function getTokenDistribution(): Promise<TokenDistribution> {
  return request<TokenDistribution>('/api/staking/token-distribution');
}

export async function getTopStakers(limit = 10): Promise<TopStaker[]> {
  return request<TopStaker[]>(`/api/staking/top-stakers?limit=${limit}`);
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  return request<ActivityItem[]>('/api/staking/recent-activity');
}

// ----- User endpoints -----

export async function getUserStake(): Promise<UserStake | null> {
  return request<UserStake | null>('/api/staking/user-stake');
}

export async function getUserStats(): Promise<UserStats> {
  return request<UserStats>('/api/staking/user-stats');
}

export async function getAvailableRewards(): Promise<AvailableRewards> {
  return request<AvailableRewards>('/api/staking/available-rewards');
}

export interface StakeRequest {
  amount: number;
  lockPeriod?: number;   // days, required for new stakes
  penalty?: number;      // 0‑1, required for new stakes
}

export async function stakeTokens(req: StakeRequest): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/staking/stake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
}

export async function reduceStake(amount: number): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/staking/reduce', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount }),
  });
}

export async function withdrawRewards(tokenId: string, amount: number): Promise<{ success: boolean }> {
  return request<{ success: boolean }>('/api/staking/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tokenId, amount }),
  });
}

export async function getUserRewardsStats(): Promise<UserRewardsStats> {
  return request<UserRewardsStats>('/api/staking/rewards-stats');
}

export async function getRewardsHistory(): Promise<RewardsHistoryItem[]> {
  return request<RewardsHistoryItem[]>('/api/staking/rewards-history');
}