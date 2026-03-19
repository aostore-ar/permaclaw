import { createFileRoute } from '@tanstack/react-router'
import { MemoryDetailPage } from '@/components/memory/MemoryDetailPage'

export const Route = createFileRoute('/memory/$memoryId')({
  component: MemoryDetailPage,
})