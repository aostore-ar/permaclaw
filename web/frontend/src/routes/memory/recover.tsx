import { createFileRoute } from '@tanstack/react-router'
import { RecoverWizard } from '@/components/memory/RecoverWizard'

export const Route = createFileRoute('/memory/recover')({
  component: RecoverWizard,
})