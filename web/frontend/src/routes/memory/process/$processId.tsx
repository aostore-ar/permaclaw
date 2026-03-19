import { createFileRoute } from '@tanstack/react-router'
import { MemoryProcessPage } from '@/components/memory/MemoryProcessPage'

export const Route = createFileRoute('/memory/process/$processId')({
  component: MemoryProcessPage,
})