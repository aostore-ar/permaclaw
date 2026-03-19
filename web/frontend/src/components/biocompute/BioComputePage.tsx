import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from '@tanstack/react-router';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { BiocomputeCard } from './BiocomputeCard';
import dummyBiocompute from '@/data/dummy_biocompute.json';

interface BiocomputeProcess {
  id: string;
  name: string;
  public: boolean;
  tokenGate?: {
    enabled: boolean;
    tokenId: string;
    minAmount: number;
  };
  created_at: number;
  spikes: any[];
  memories: any[];
}

export function BiocomputePage() {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState<BiocomputeProcess[]>([]);
  const [filtered, setFiltered] = useState<BiocomputeProcess[]>([]);
  const [search, setSearch] = useState('');
  const [tokenGateFilter, setTokenGateFilter] = useState<string>('all');

  useEffect(() => {
    // Load only public processes
    const publicProcesses = dummyBiocompute.filter(p => p.public) as BiocomputeProcess[];
    setProcesses(publicProcesses);
    setFiltered(publicProcesses);
  }, []);

  useEffect(() => {
    let result = processes.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesTokenGate =
        tokenGateFilter === 'all' ||
        (tokenGateFilter === 'gated' && p.tokenGate?.enabled) ||
        (tokenGateFilter === 'ungated' && !p.tokenGate?.enabled);
      return matchesSearch && matchesTokenGate;
    });
    setFiltered(result);
  }, [search, tokenGateFilter, processes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🧬 {t('biocompute.public_biocompute')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/biocompute/my">
              <span className="mr-2">📋</span> {t('biocompute.my_biocompute')}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/biocompute/spawn">
              <Plus className="mr-2 h-4 w-4" /> {t('biocompute.spawn_new')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('biocompute.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tokenGateFilter} onValueChange={setTokenGateFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('biocompute.filter_token_gate')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('biocompute.all')}</SelectItem>
            <SelectItem value="gated">{t('biocompute.token_gated')}</SelectItem>
            <SelectItem value="ungated">{t('biocompute.ungated')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(process => (
          <BiocomputeCard key={process.id} process={process} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('biocompute.no_public_processes')}
        </div>
      )}
    </div>
  );
}