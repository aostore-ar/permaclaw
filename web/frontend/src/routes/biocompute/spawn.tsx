import { createFileRoute } from '@tanstack/react-router'
import { SpawnBiocomputePage } from '@/components/biocompute/SpawnBiocomputePage'

export const Route = createFileRoute('/biocompute/spawn')({
  component: SpawnBiocomputePage,
})