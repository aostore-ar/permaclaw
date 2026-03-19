import { createFileRoute } from '@tanstack/react-router'
import { UserStakingDashboard } from '@/components/store/UserStakingDashboard'

export const Route = createFileRoute('/store/staking/user')({
  component: UserStakingDashboard,
})
