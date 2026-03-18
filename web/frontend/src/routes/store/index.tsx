import { createFileRoute } from '@tanstack/react-router'
import StorePage from '@/components/store/StorePage'

export const Route = createFileRoute('/store/')({
  component: StorePage,
})