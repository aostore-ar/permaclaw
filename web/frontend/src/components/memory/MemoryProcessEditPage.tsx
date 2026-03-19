import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';
import dummyProcesses from '@/data/dummy_memories.json';

// Type definition based on your dummy data structure
interface TokenGate {
  enabled: boolean;
  tokenId: string;
  minAmount: number;
}

interface MemoryProcess {
  id: string;
  name: string;
  type: string;
  public: boolean;
  created_at: number;
  memories: any[];
  tokenGate?: TokenGate;
}

export function MemoryProcessEditPage() {
  const { processId } = useParams({ from: '/memory/process/$processId/edit' });
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [enableTokenGate, setEnableTokenGate] = useState(false);
  const [tokenId, setTokenId] = useState('AOS');
  const [tokenAmount, setTokenAmount] = useState('');

  useEffect(() => {
    const found = (dummyProcesses as MemoryProcess[]).find(p => p.id === processId);
    if (found) {
      setName(found.name);
      setType(found.type);
      setIsPublic(found.public);
      if (found.tokenGate) {
        setEnableTokenGate(found.tokenGate.enabled);
        setTokenId(found.tokenGate.tokenId);
        setTokenAmount(found.tokenGate.minAmount.toString());
      } else {
        setEnableTokenGate(false);
      }
    }
    setLoading(false);
  }, [processId]);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    setTimeout(() => {
      setSaving(false);
      alert('Process updated (demo)');
      navigate({ to: '/memory/process/$processId', params: { processId } });
    }, 1000);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back link */}
      <Link
        to="/memory/process/$processId"
        params={{ processId }}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('memory.back_to_process')}
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>{t('memory.edit_process')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('memory.process_name')}</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
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
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => navigate({ to: '/memory/process/$processId', params: { processId } })}
          >
            {t('common.cancel')}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? t('common.saving') : t('common.save')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}