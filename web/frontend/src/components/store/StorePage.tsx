import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import ProductCard from './ProductCard'

// Dummy data
const dummyProducts = [
  { id: '1', name: 'Web Search Skill', description: 'Search the web using multiple providers', type: 'Device' },
  { id: '2', name: 'File Editor', description: 'Edit files directly in the workspace', type: 'Device' },
  { id: '3', name: 'Cron Scheduler', description: 'Schedule recurring tasks', type: 'Device' },
  { id: '4', name: 'Neural Spike Analyzer', description: 'Analyze CL1 spike data', type: 'DApp' },
]

export default function StorePage() {
  const { t } = useTranslation()
  const [products] = useState(dummyProducts)

  const handleInstall = (id: string) => {
    console.log('Install product', id)
    // TODO: call API
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">{t('store.title', 'Store')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            description={product.description}
            onInstall={handleInstall}
          />
        ))}
      </div>
    </div>
  )
}