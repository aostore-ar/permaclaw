import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Globe, Lock, Edit } from 'lucide-react';
import { SpikeChart } from './SpikeChart';
import { ExperimentSelector } from './ExperimentSelector';
import { TokenGateDialog } from '@/components/memory/TokenGateDialog';
import dummyBiocompute from '@/data/dummy_biocompute.json';

// For demo, assume current user owns these biocompute processes
const ownedProcessIds = ['bio1', 'bio2', 'bio3', 'bio4', 'bio5']; // all for demo

export function BiocomputeProcessPage() {
  const { processId } = useParams({ from: '/biocompute/process/$processId' });
  const { t } = useTranslation();
  const [process, setProcess] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userHasAccess, setUserHasAccess] = useState(false);
  const [showTokenGate, setShowTokenGate] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<string>('all');

  useEffect(() => {
    const found = dummyBiocompute.find(p => p.id === processId);
    setProcess(found || null);
    if (found) {
      const isOwner = ownedProcessIds.includes(found.id);
      if (isOwner) {
        setUserHasAccess(true);
      } else if (found.tokenGate?.enabled) {
        setUserHasAccess(false);
      } else {
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

  const experiments = process.spikes
    ? [...new Set(process.spikes.map((s: any) => s.experiment).filter(Boolean))]
    : [];

  const filteredSpikes = process.spikes
    ? selectedExperiment === 'all'
      ? process.spikes
      : process.spikes.filter((s: any) => s.experiment === selectedExperiment)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link to="/biocompute" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-1" /> {t('biocompute.back_to_dashboard')}
        </Link>
        {isOwner && (
          <Button variant="outline" size="sm" asChild>
            <Link to={`/biocompute/process/${processId}/edit`}>
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
        </div>
      </div>

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
        <>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">{t('biocompute.spike_data')}</h2>
                {experiments.length > 0 && (
                  <ExperimentSelector
                    experiments={experiments}
                    selected={selectedExperiment}
                    onSelect={setSelectedExperiment}
                  />
                )}
              </div>
              <SpikeChart spikes={filteredSpikes} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">{t('biocompute.associated_memories')}</h2>
            {process.memories.map((memory: any) => (
              <Card key={memory.id}>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {new Date(memory.timestamp).toLocaleString()} • {t('memory.importance')}: {memory.importance}
                  </p>
                  <p className="whitespace-pre-wrap">{memory.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      <TokenGateDialog
        open={showTokenGate}
        onOpenChange={setShowTokenGate}
        tokenId={process.tokenGate?.tokenId || 'AOS'}
        amount={process.tokenGate?.minAmount || 0}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}