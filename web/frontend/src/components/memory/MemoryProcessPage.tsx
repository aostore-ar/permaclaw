import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Lock, Edit } from 'lucide-react';
import { TokenGateDialog } from './TokenGateDialog';
import dummyProcesses from '@/data/dummy_memories.json';

// For demo, assume current user owns these processes (same as MyMemoriesPage)
const ownedProcessIds = [ 'proc2', 'proc5', 'proc6'];

export function MemoryProcessPage() {
  const { processId } = useParams({ from: '/memory/process/$processId' });
  const { t } = useTranslation();
  const [process, setProcess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [showTokenGate, setShowTokenGate] = useState(false);

  useEffect(() => {
    const found = dummyProcesses.find(p => p.id === processId);
    setProcess(found || null);
    if (found) {
      const isOwner = ownedProcessIds.includes(found.id);
      if (isOwner) {
        // Owner always has access
        setUserHasAccess(true);
      } else if (found.tokenGate?.enabled) {
        // Non‑owner and token‑gated: no access yet
        setUserHasAccess(false);
      } else {
        // Non‑owner but not token‑gated: grant access
        setUserHasAccess(true);
      }
    }
    setLoading(false);
  }, [processId]);

  const handlePaymentSuccess = () => {
    setUserHasAccess(true);
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!process) return <div className="text-center py-12">Process not found</div>;

  const isOwner = ownedProcessIds.includes(process.id);
  const canEdit = isOwner && process.type === 'personal'; // optional

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/memory" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('memory.back_to_catalog')}
        </Link>
        {canEdit && (
          <Button variant="outline" size="sm" asChild>
            <Link to="/memory/process/$processId/edit" params={{ processId }}>
              <Edit className="h-4 w-4 mr-2" /> {t('memory.edit')}
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{process.name}</h1>
        <div className="flex items-center gap-2">
          {process.public ? (
            <Globe className="h-5 w-5 text-green-500" />
          ) : (
            <Lock className="h-5 w-5 text-yellow-500" />
          )}
          <span className="text-sm capitalize">{process.type}</span>
        </div>
      </div>

      {/* Show token‑gate warning only to non‑owners */}
      {!isOwner && process.tokenGate?.enabled && !userHasAccess && (
        <Card className="border-yellow-500/50">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{t('memory.token_gated')}</p>
              <p className="text-sm text-muted-foreground">
                {t('memory.requires')} {process.tokenGate.minAmount} {process.tokenGate.tokenId}
              </p>
            </div>
            <Button size="sm" onClick={() => setShowTokenGate(true)}>
              {t('memory.pay_to_access')}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Access denied screen (only for non‑owners who haven't paid) */}
      {!userHasAccess ? (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-2">🔒 {t('memory.token_required')}</p>
            <p className="text-sm text-muted-foreground mb-4">
              {t('memory.need_tokens')} {process.tokenGate?.minAmount} {process.tokenGate?.tokenId}
            </p>
            <Button onClick={() => setShowTokenGate(true)}>
              {t('memory.pay_and_access')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Memories (owners see this immediately; non‑owners see after payment)
        <div className="space-y-4">
          {process.memories.map((memory: any) => (
            <Card key={memory.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">
                      {new Date(memory.timestamp).toLocaleString()} • {t('memory.importance')}: {memory.importance}
                    </p>
                    <p className="whitespace-pre-wrap">{memory.content}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild className="ml-4">
                    <Link to="/memory/$memoryId" params={{ memoryId: memory.id }}>
                      {t('memory.view')}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TokenGateDialog
        open={showTokenGate}
        onOpenChange={setShowTokenGate}
        tokenId={process.tokenGate?.tokenId || 'AOS'}
        amount={process.tokenGate?.minAmount || 0.01}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}