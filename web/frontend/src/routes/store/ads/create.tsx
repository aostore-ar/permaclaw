import { createFileRoute } from '@tanstack/react-router'
import { CreateAdForm } from '@/components/store/CreateAdForm'

export const Route = createFileRoute('/store/ads/create')({
  component: CreateAdForm,
})