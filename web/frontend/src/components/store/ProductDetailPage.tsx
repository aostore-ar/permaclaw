import { useTranslation } from 'react-i18next'
import { useParams } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

// Dummy product details (in real app, fetch by id)
const dummyProductDetails: Record<string, any> = {
  '1': {
    name: 'Web Search Skill',
    description: 'Search the web using multiple providers',
    type: 'Device',
    version: '1.2.0',
    metadata: { author: 'PermaClaw Team', size: '2.3 MB' },
  },
  '2': {
    name: 'File Editor',
    description: 'Edit files directly in the workspace',
    type: 'Device',
    version: '0.9.5',
    metadata: { author: 'Community', size: '1.1 MB' },
  },
}

export default function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams({ from: '/store/products/$id' })
  const [product] = useState(dummyProductDetails[id] || { name: 'Unknown', description: 'No details available' })

  const handleInstall = () => {
    console.log('Install product', id)
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2">{product.description}</p>
          <p className="text-sm text-muted-foreground mb-4">Type: {product.type}</p>
          {product.version && <p className="text-sm">Version: {product.version}</p>}
          <Button className="mt-4" onClick={handleInstall}>
            {t('store.install', 'Install')}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}