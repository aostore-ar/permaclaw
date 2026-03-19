import { createFileRoute } from '@tanstack/react-router'
import { ProductDetailPage } from '@/components/store/ProductDetailPage'

export const Route = createFileRoute('/store/$id')({
  component: ProductDetailPage,
})
