import { createFileRoute } from '@tanstack/react-router'
import { MyBiocomputePage } from '@/components/biocompute/MyBiocomputePage'

export const Route = createFileRoute('/biocompute/my')({
  component: MyBiocomputePage,
})