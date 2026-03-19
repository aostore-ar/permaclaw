import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import dummyProcesses from '@/data/dummy_memories.json';

export function MemoryDetailPage() {
  const { memoryId } = useParams({ from: '/memory/$memoryId' });
  const { t } = useTranslation();
  const [memory, setMemory] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find memory across all processes
    for (const process of dummyProcesses) {
      const found = process.memories.find((m: any) => m.id === memoryId);
      if (found) {
        setMemory(found);
        break;
      }
    }
    setLoading(false);
  }, [memoryId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (!memory) return <div className="text-center py-12">Memory not found</div>;

  return (
    <div className="space-y-6">
      <Link to="/memory" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('memory.back_to_catalog')}
      </Link>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">{t('memory.memory_detail')}</h1>
            <span className="text-sm bg-muted px-2 py-1 rounded">
              Importance: {memory.importance}
            </span>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              {new Date(memory.timestamp).toLocaleString()}
            </p>
            <p className="whitespace-pre-wrap text-lg">{memory.content}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}