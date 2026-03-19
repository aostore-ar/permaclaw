
import { createFileRoute } from '@tanstack/react-router'
import { OwnerDashboard } from '@/components/store/OwnerDashboard'

export const Route = createFileRoute('/store/dapps/')({
  component: OwnerDashboard,
})