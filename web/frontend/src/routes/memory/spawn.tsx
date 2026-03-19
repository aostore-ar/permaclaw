import { createFileRoute } from '@tanstack/react-router'
import { SpawnMemoryPage } from '../../components/memory/SpawnMemoryPage'

export const Route = createFileRoute('/memory/spawn')({
  component: SpawnMemoryPage,
})