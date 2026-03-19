import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Lock, Globe } from 'lucide-react';

interface MemoryProcess {
  id: string;
  name: string;
  type: string;
  public: boolean;
  created_at: number;
  memories: any[];
}

export function MemoryCard({ process }: { process: MemoryProcess }) {
  const typeEmoji: Record<string, string> = {
    personal: '👤',
    work: '💼',
    biocompute: '🧬',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{process.name}</h3>
          <span className="text-2xl">{typeEmoji[process.type] || '📁'}</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{process.memories.length} memories</span>
          <span>•</span>
          <span className="capitalize">{process.type}</span>
          <span>•</span>
          {process.public ? (
            <Globe className="h-4 w-4 text-green-500" />
          ) : (
            <Lock className="h-4 w-4 text-yellow-500" />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          Created {new Date(process.created_at).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to="/memory/process/$processId" params={{ processId: process.id }}>
            <Eye className="mr-2 h-4 w-4" /> View Memories
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}