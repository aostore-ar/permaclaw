import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface TokenGateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tokenId: string;
  amount: number;
  onSuccess: () => void;
}

export function TokenGateDialog({
  open,
  onOpenChange,
  tokenId,
  amount,
  onSuccess,
}: TokenGateDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleProceed = async () => {
    setLoading(true);
    setError('');
    // Simulate sending tokens
    try {
      await new Promise((resolve, reject) => {
        setTimeout(() => {
          // Random success/failure for demo
          if (Math.random() > 0.2) {
            resolve(true);
          } else {
            reject(new Error('Transaction failed'));
          }
        }, 2000);
      });
      setLoading(false);
      onSuccess();
      onOpenChange(false);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || t('tokenGate.transaction_failed'));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('tokenGate.title')}</DialogTitle>
          <DialogDescription>
            {t('tokenGate.description', { amount, token: tokenId })}
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleProceed} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? t('tokenGate.sending') : t('tokenGate.proceed')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}