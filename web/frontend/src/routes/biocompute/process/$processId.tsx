import { createFileRoute } from '@tanstack/react-router'
import { BiocomputeProcessPage } from '@/components/biocompute/BiocomputeProcessPage'

export const Route = createFileRoute('/biocompute/process/$processId')({
  component: BiocomputeProcessPage,
})