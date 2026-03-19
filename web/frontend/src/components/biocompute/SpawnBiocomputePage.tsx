import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Info } from 'lucide-react';
import { Link } from '@tanstack/react-router';

export function SpawnBiocomputePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [enableTokenGate, setEnableTokenGate] = useState(false);
  const [tokenId, setTokenId] = useState('AOS');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSpawn = async () => {
    if (!name.trim()) return;
    if (enableTokenGate && (!tokenAmount || parseFloat(tokenAmount) <= 0)) {
      alert(t('biocompute.token_amount_required'));
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(t('biocompute.spawn_success', { name }));
      navigate({ to: '/biocompute' });
    }, 1500);
  };

  const isFormValid = name.trim() && (!enableTokenGate || (tokenAmount && parseFloat(tokenAmount) > 0));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link to="/biocompute" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('biocompute.back_to_catalog')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{t('biocompute.spawn_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('biocompute.process_name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('biocompute.name_placeholder')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="public">{t('biocompute.public')}</Label>
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="tokenGate">{t('biocompute.token_gate')}</Label>
                <Switch id="tokenGate" checked={enableTokenGate} onCheckedChange={setEnableTokenGate} />
              </div>

              {enableTokenGate && (
                <div className="space-y-4 border-l-2 pl-4 border-primary/30">
                  <div className="space-y-2">
                    <Label htmlFor="tokenId">{t('biocompute.token_id')}</Label>
                    <Select value={tokenId} onValueChange={setTokenId}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AOS">AOS</SelectItem>
                        <SelectItem value="USDA">USDA</SelectItem>
                        <SelectItem value="USDC">USDC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tokenAmount">{t('biocompute.min_amount')}</Label>
                    <Input
                      id="tokenAmount"
                      type="number"
                      min="0"
                      step="0.01"
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      placeholder="1000"
                    />
                    {tokenAmount && parseFloat(tokenAmount) <= 0 && (
                      <p className="text-sm text-destructive mt-1">{t('biocompute.invalid_amount')}</p>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{t('biocompute.token_gate_info', { token: tokenId, amount: tokenAmount || '…' })}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate({ to: '/biocompute' })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSpawn} disabled={!isFormValid || loading}>
            {loading ? t('common.spawning') : t('biocompute.spawn')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}