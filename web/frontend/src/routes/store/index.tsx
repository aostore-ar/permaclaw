import { createFileRoute } from '@tanstack/react-router'
import { CatalogPage } from '@/components/store/CatalogPage'

export const Route = createFileRoute('/store/')({
  component: CatalogPage,
})