import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

interface InstallButtonProps {
  productId: string
  onInstalled?: () => void
}

export default function InstallButton({ productId, onInstalled }: InstallButtonProps) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleInstall = async () => {
    setLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Installed', productId)
    setLoading(false)
    onInstalled?.()
  }

  return (
    <Button onClick={handleInstall} disabled={loading}>
      {loading ? t('common.installing', 'Installing...') : t('store.install', 'Install')}
    </Button>
  )
}