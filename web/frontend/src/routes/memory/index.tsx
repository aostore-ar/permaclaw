// src/routes/memory/index.tsx
import { createFileRoute } from '@tanstack/react-router'
import { MemoryPage } from '@/components/memory/MemoryPage'

export const Route = createFileRoute('/memory/')({
  component: MemoryPage,
})