import { createFileRoute } from '@tanstack/react-router'
import { AdsDashboard } from '@/components/store/AdsDashboard' // you'll create this

export const Route = createFileRoute('/store/ads/')({
  component: AdsDashboard,
})