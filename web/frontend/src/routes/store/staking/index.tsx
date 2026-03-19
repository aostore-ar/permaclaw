import { createFileRoute } from '@tanstack/react-router'
import { StakingDashboard } from '@/components/store/StakingDashboard'

export const Route = createFileRoute('/store/staking/')({
  component: StakingDashboard,
})