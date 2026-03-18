import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

interface ProductCardProps {
  id: string
  name: string
  description: string
  onInstall: (id: string) => void
}

export default function ProductCard({ id, name, description, onInstall }: ProductCardProps) {
  const { t } = useTranslation()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        <Button onClick={() => onInstall(id)}>{t('store.install', 'Install')}</Button>
      </CardContent>
    </Card>
  )
}