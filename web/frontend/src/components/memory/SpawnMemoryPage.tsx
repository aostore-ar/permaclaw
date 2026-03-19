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

export function SpawnMemoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [type, setType] = useState('personal');
  const [isPublic, setIsPublic] = useState(false);
  const [enableTokenGate, setEnableTokenGate] = useState(false);
  const [tokenId, setTokenId] = useState('AOS');
  const [tokenAmount, setTokenAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSpawn = async () => {
    if (!name.trim()) return;
    if (enableTokenGate && (!tokenAmount || parseFloat(tokenAmount) <= 0)) {
      alert(t('memory.token_amount_required'));
      return;
    }
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      alert(t('memory.spawn_success', { name }));
      navigate({ to: '/memory' });
    }, 1500);
  };

  const isFormValid = name.trim() && (!enableTokenGate || (tokenAmount && parseFloat(tokenAmount) > 0));

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <Link to="/memory" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('memory.back_to_catalog')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{t('memory.spawn_title')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('memory.process_name')}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('memory.name_placeholder')}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">{t('memory.process_type')}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">{t('memory.type_personal')}</SelectItem>
                <SelectItem value="work">{t('memory.type_work')}</SelectItem>
                <SelectItem value="biocompute">{t('memory.type_biocompute')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="public">{t('memory.public')}</Label>
            <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
          </div>

          {isPublic && (
            <>
              <div className="flex items-center justify-between pt-2">
                <Label htmlFor="tokenGate">{t('memory.token_gate')}</Label>
                <Switch id="tokenGate" checked={enableTokenGate} onCheckedChange={setEnableTokenGate} />
              </div>

              {enableTokenGate && (
                <div className="space-y-4 border-l-2 pl-4 border-primary/30">
                  <div className="space-y-2">
                    <Label htmlFor="tokenId">{t('memory.token_id')}</Label>
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
                    <Label htmlFor="tokenAmount">{t('memory.min_amount')}</Label>
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
                      <p className="text-sm text-destructive mt-1">{t('memory.invalid_amount')}</p>
                    )}
                  </div>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <p>{t('memory.token_gate_info', { token: tokenId, amount: tokenAmount || '…' })}</p>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => navigate({ to: '/memory' })}>
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSpawn} disabled={!isFormValid || loading}>
            {loading ? t('common.spawning') : t('memory.spawn')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}