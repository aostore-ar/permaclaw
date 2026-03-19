import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

export function RecoverWizard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [processId, setProcessId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRecover = async () => {
    if (!processId.trim()) {
      setError('Process ID is required');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Dummy success – in real app would check existence
      alert(`Recovered from process ${processId} (demo)`);
      navigate({ to: '/memory' });
    }, 1500);
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{t('memory.recover_title')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {t('memory.recover_description')}
        </p>
        <div className="space-y-2">
          <Label htmlFor="processId">{t('memory.process_id')}</Label>
          <Input
            id="processId"
            value={processId}
            onChange={(e) => setProcessId(e.target.value)}
            placeholder="e.g., 0xabc...def"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={() => navigate({ to: '/memory' })}>
          {t('common.cancel')}
        </Button>
        <Button onClick={handleRecover} disabled={loading}>
          {loading ? t('common.recovering') : t('memory.recover')}
        </Button>
      </CardFooter>
    </Card>
  );
}