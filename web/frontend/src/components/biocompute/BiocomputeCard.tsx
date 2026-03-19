import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Globe, Lock, Eye } from 'lucide-react';

interface BiocomputeCardProps {
  process: {
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
  };
}

export function BiocomputeCard({ process }: BiocomputeCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold">{process.name}</h3>
          <span className="text-2xl">🧬</span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>{process.spikes.length} spikes</span>
          <span>•</span>
          <span>{process.memories.length} notes</span>
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
        {process.tokenGate?.enabled && (
          <div className="mt-2 inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
            <Lock className="h-3 w-3" />
            Requires {process.tokenGate.minAmount} {process.tokenGate.tokenId}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link to="/biocompute/process/$processId" params={{ processId: process.id }}>
            <Eye className="mr-2 h-4 w-4" /> View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}