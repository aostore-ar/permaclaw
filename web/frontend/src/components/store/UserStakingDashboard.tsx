import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import dummyUser from '@/data/dummy_staking_user.json';

interface UserStake {
  amount: number;
  staked_at: number;
  lock_period: number;
  penalty: number;
  unlock_time: number;
}

interface AvailableRewards {
  [token: string]: number;
}

export function UserStakingDashboard() {
  useTranslation();
  const [stake, setStake] = useState<UserStake | null>(null);
  const [stats, setStats] = useState<any>(null);
  const [availableRewards, setAvailableRewards] = useState<AvailableRewards>({});
  const [rewardsHistory, setRewardsHistory] = useState<any[]>([]);
  const [addAmount, setAddAmount] = useState('');
  const [reduceAmount, setReduceAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Load dummy user data
    setStake(dummyUser.userStake as UserStake);
    setStats(dummyUser.userStats);
    setAvailableRewards(dummyUser.availableRewards);
    setRewardsHistory(dummyUser.rewardsHistory);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const calculateProgress = () => {
    if (!stake) return 0;
    const now = Date.now();
    const total = stake.unlock_time - stake.staked_at;
    const elapsed = now - stake.staked_at;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const daysRemaining = stake ? Math.max(0, Math.floor((stake.unlock_time - Date.now()) / (1000 * 60 * 60 * 24))) : 0;
  const isReady = daysRemaining === 0;

  if (!stake) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">👤 My Staking</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">You don't have an active stake yet.</p>
            <Button onClick={() => setActiveTab('stake')}>Create Your First Stake</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">👤 My Staking</h1>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Staked</p>
            <p className="text-2xl font-bold">{formatNumber(stake.amount)} AOS</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Available Rewards</p>
            <p className="text-2xl font-bold text-green-500">{formatNumber(stats?.available_rewards || 0)} AOS</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Days Remaining</p>
            <p className="text-2xl font-bold">{daysRemaining}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Early Penalty</p>
            <p className="text-2xl font-bold text-red-500">{(stake.penalty * 100).toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Stake Progress */}
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Your Stake</h2>
            <span className={`px-2 py-1 rounded text-sm ${isReady ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
              {isReady ? 'Ready' : 'Locked'}
            </span>
          </div>
          <Progress value={calculateProgress()} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-muted-foreground">
            <span>Staked: {formatDate(stake.staked_at)}</span>
            <span>Unlocks: {formatDate(stake.unlock_time)}</span>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="stake">Add Stake</TabsTrigger>
          <TabsTrigger value="reduce">Reduce Stake</TabsTrigger>
          <TabsTrigger value="withdraw">Withdraw Rewards</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-2">Available Rewards</h3>
              <div className="space-y-2">
                {Object.entries(availableRewards).map(([token, amount]) => (
                  <div key={token} className="flex justify-between items-center p-2 bg-green-500/10 rounded">
                    <span className="font-medium">{token}</span>
                    <span className="font-semibold text-green-500">{formatNumber(amount)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stake">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Add to Your Stake</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount (AOS)</Label>
                  <Input
                    id="amount"
                    type="number"
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button disabled={!addAmount || parseFloat(addAmount) <= 0}>Add to Stake</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reduce">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Reduce Stake</h3>
              {!isReady && (
                <div className="mb-4 p-3 bg-yellow-500/10 rounded border border-yellow-500/30">
                  <p className="text-yellow-500 text-sm">⚠️ Early withdrawal penalty of {(stake.penalty * 100).toFixed(1)}% applies.</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="reduceAmount">Amount (AOS)</Label>
                  <Input
                    id="reduceAmount"
                    type="number"
                    value={reduceAmount}
                    onChange={(e) => setReduceAmount(e.target.value)}
                    placeholder="Enter amount"
                  />
                </div>
                <Button disabled={!reduceAmount || parseFloat(reduceAmount) <= 0} variant="destructive">
                  Reduce Stake
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdraw">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Withdraw Rewards</h3>
              <div className="space-y-4">
                <div>
                  <Label>Select Token</Label>
                  <div className="flex gap-2 mt-1">
                    {Object.entries(availableRewards).map(([token, amount]) => (
                      <Button
                        key={token}
                        variant={selectedToken === token ? 'default' : 'outline'}
                        onClick={() => setSelectedToken(token)}
                        disabled={amount === 0}
                      >
                        {token} ({formatNumber(amount)})
                      </Button>
                    ))}
                  </div>
                </div>
                {selectedToken && (
                  <div>
                    <Label htmlFor="withdrawAmount">Amount</Label>
                    <Input
                      id="withdrawAmount"
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      placeholder="Enter amount"
                    />
                  </div>
                )}
                <Button disabled={!selectedToken || !withdrawAmount || parseFloat(withdrawAmount) <= 0}>
                  Withdraw
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-semibold mb-4">Rewards History</h3>
              <div className="space-y-2">
                {rewardsHistory.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 border-b last:border-0">
                    <div>
                      <p className="font-medium capitalize">{item.type}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(item.timestamp)}</p>
                    </div>
                    <p className={`font-semibold ${item.type === 'withdraw' ? 'text-red-500' : 'text-green-500'}`}>
                      {item.type === 'withdraw' ? '-' : '+'}{formatNumber(item.amount)} {item.token_id}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}