import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MemoryCard } from './MemoryCard';
import { Button } from '@/components/ui/button';
import { Search, Plus, Edit } from 'lucide-react';
import dummyProcesses from '@/data/dummy_memories.json';
import { Link } from '@tanstack/react-router';

interface MemoryProcess {
  id: string;
  name: string;
  type: string;
  public: boolean;
  created_at: number;
  memories: any[];
}

export function MemoryPage() {
  const { t } = useTranslation();
  const [processes, setProcesses] = useState<MemoryProcess[]>([]);
  const [filtered, setFiltered] = useState<MemoryProcess[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  useEffect(() => {
    // Load only public processes for catalog, excluding biocompute
    const publicProcesses = dummyProcesses.filter(
      p => p.public && p.type !== 'biocompute'
    ) as MemoryProcess[];
    setProcesses(publicProcesses);
    setFiltered(publicProcesses);
  }, []);

  useEffect(() => {
    let result = processes.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || p.type === typeFilter;
      return matchesSearch && matchesType;
    });
    setFiltered(result);
  }, [search, typeFilter, processes]);

  const types = ['all', 'personal', 'work']; // biocompute excluded

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('memory.public_memories')}</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link to="/memory/my">
              <Edit className="mr-2 h-4 w-4" /> {t('memory.my_memories')}
            </Link>
          </Button>
          <Button asChild>
            <Link to="/memory/spawn">
              <Plus className="mr-2 h-4 w-4" /> {t('memory.spawn_process')}
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('memory.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('memory.filter_type')} />
          </SelectTrigger>
          <SelectContent>
            {types.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? t('memory.all_types') : t(`memory.type_${type}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(process => (
          <MemoryCard key={process.id} process={process} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('memory.no_public_processes')}
        </div>
      )}
    </div>
  );
}