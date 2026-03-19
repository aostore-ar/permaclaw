import { createFileRoute } from '@tanstack/react-router'
import { MemoryProcessEditPage } from '@/components/memory/MemoryProcessEditPage'

export const Route = createFileRoute('/memory/process/$processId/edit')({
  component: MemoryProcessEditPage,
})