
import { createFileRoute } from '@tanstack/react-router'
import { MyMemoriesPage } from '@/components/memory/MyMemoriesPage'

export const Route = createFileRoute('/memory/my')({
  component: MyMemoriesPage,
})
