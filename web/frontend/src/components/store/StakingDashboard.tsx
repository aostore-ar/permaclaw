import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import dummyGlobal from '@/data/dummy_staking_global.json';

// Types (should match API eventually)
interface PlatformStats {
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

interface EpochRewards {
  [token: string]: number;
  epoch_progress: number;
  time_remaining: number;
  next_distribution: number;
}

interface TokenDistribution {
  [token: string]: {
    percentage: number;
    amount: number;
  };
}

interface ActivityItem {
  type: string;
  user: string;
  amount: number;
  token: string;
  time_ago: string;
  timestamp: number;
}

export function StakingDashboard() {
  useTranslation();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [epochRewards, setEpochRewards] = useState<EpochRewards | null>(null);
  const [distribution, setDistribution] = useState<TokenDistribution | null>(null);
  const [topStakers, setTopStakers] = useState<Array<{ address: string; amount: number }>>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load dummy data
    setStats(dummyGlobal.platformStats as PlatformStats);
    setEpochRewards(dummyGlobal.epochRewards as unknown as EpochRewards);
    setDistribution(dummyGlobal.tokenDistribution as TokenDistribution);
    setTopStakers(dummyGlobal.topStakers);
    setActivity(dummyGlobal.recentActivity as ActivityItem[]);
    setLoading(false);
  }, []);

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const formatLargeNumber = (num: number) => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🌍 Staking Dashboard</h1>
        <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Value Staked</p>
            <p className="text-2xl font-bold">{formatLargeNumber(stats!.total_staked)} AOS</p>
            <p className="text-xs text-green-500">+{stats!.staked_growth}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Rewards</p>
            <p className="text-2xl font-bold">{formatLargeNumber(stats!.total_rewards)} AOS</p>
            <p className="text-xs text-green-500">+{stats!.rewards_growth}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Active Stakers</p>
            <p className="text-2xl font-bold">{formatNumber(stats!.active_stakers)}</p>
            <p className="text-xs text-green-500">+{stats!.stakers_growth}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Current Epoch</p>
            <p className="text-2xl font-bold">#{stats!.current_epoch}</p>
            <p className="text-xs text-muted-foreground">Progress {Math.round((epochRewards?.epoch_progress || 0) * 100)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Reward Formula */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">🎯 Enhanced Reward Formula</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Time Staked', percent: 25, icon: '⏱️' },
              { label: 'Epoch Amount', percent: 30, icon: '💰' },
              { label: 'Penalty', percent: 25, icon: '⚡' },
              { label: 'User Balance', percent: 20, icon: '🏦' },
            ].map(factor => (
              <div key={factor.label} className="bg-primary/10 p-3 rounded-lg text-center">
                <div className="text-3xl mb-1">{factor.icon}</div>
                <div className="text-sm font-medium">{factor.label}</div>
                <div className="text-lg font-bold text-primary">{factor.percent}%</div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-green-500/10 rounded-lg">
            <p className="text-green-500 text-sm">🎉 Single Stake System – Each user maintains one stake that can be added over time.</p>
          </div>
        </CardContent>
      </Card>

      {/* Two column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">📊 Platform Overview</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Average APY:</span>
                <span className="text-green-500 font-semibold">{stats!.average_apy}%</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee:</span>
                <span>{stats!.platform_fee}%</span>
              </div>
              <div className="flex justify-between">
                <span>Avg Staking Duration:</span>
                <span>{stats!.avg_staking_duration} days</span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <h3 className="font-medium mb-2">Weekly Performance</h3>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>New Stakers:</span>
                  <span className="text-green-500">{stats!.weekly_new_stakers}</span>
                </div>
                <div className="flex justify-between">
                  <span>Volume:</span>
                  <span>{formatLargeNumber(stats!.weekly_volume)} AOS</span>
                </div>
                <div className="flex justify-between">
                  <span>Rewards Distributed:</span>
                  <span className="text-green-500">{formatLargeNumber(stats!.weekly_rewards)} AOS</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">🎯 Current Epoch Rewards</h2>
            <div className="space-y-3">
              {epochRewards && Object.entries(epochRewards)
                .filter(([key]) => !['epoch_progress', 'time_remaining', 'next_distribution'].includes(key))
                .map(([token, amount]) => (
                  <div key={token} className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                    <span className="font-medium">{token}</span>
                    <span className="font-semibold text-green-500">{amount.toLocaleString()}</span>
                  </div>
                ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Time remaining: {epochRewards?.time_remaining}</p>
              <p className="text-sm text-muted-foreground">Next distribution: {epochRewards?.next_distribution ? new Date(epochRewards.next_distribution).toLocaleString() : 'N/A'}</p>
              <Progress value={(epochRewards?.epoch_progress || 0) * 100} className="mt-2 h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Distribution */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">💎 Token Distribution</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {distribution && Object.entries(distribution).map(([token, data]) => (
              <div key={token} className="bg-muted p-4 rounded-lg">
                <div className="text-2xl font-bold text-primary">{data.percentage.toFixed(1)}%</div>
                <div className="font-medium">{token}</div>
                <div className="text-sm text-muted-foreground">{formatLargeNumber(data.amount)} Tokens</div>
                <Progress value={data.percentage} className="mt-2 h-1.5" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Stakers and Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">🏆 Top Stakers</h2>
            <div className="space-y-3">
              {topStakers.map((staker, i) => (
                <div key={staker.address} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`}</span>
                    <span className="font-mono text-sm">{staker.address}</span>
                  </div>
                  <span className="font-semibold">{formatLargeNumber(staker.amount)} AOS</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">📈 Recent Activity</h2>
            <div className="space-y-3">
              {activity.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-muted rounded">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{item.type === 'stake' ? '💰' : item.type === 'unstake' ? '📤' : '🎁'}</span>
                    <div>
                      <p className="text-sm font-medium capitalize">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{item.user}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-green-500">+{item.amount} {item.token}</p>
                    <p className="text-xs text-muted-foreground">{item.time_ago}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="text-center p-6">
        <h2 className="text-2xl font-bold mb-2">Ready to Start Staking?</h2>
        <p className="text-muted-foreground mb-4">Experience our enhanced single‑stake system with fair reward distribution.</p>
        <Button asChild size="lg" className="bg-green-500 hover:bg-green-600">
          <a href="/store/staking/user">🚀 Go to User Dashboard</a>
        </Button>
      </Card>
    </div>
  );
}