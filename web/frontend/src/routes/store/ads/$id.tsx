import { createFileRoute } from '@tanstack/react-router'
import { AdDetailPage } from '@/components/store/AdDetailPage'

export const Route = createFileRoute('/store/ads/$id')({
  component: AdDetailPage,
})