import { createFileRoute } from '@tanstack/react-router'
import { BiocomputePage } from '../../components/biocompute/BioComputePage'

export const Route = createFileRoute('/biocompute/')({
  component: BiocomputePage,
})