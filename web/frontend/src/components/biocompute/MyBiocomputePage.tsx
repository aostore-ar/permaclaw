import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Eye, Edit, Globe, Lock, Trash2, X, Check } from 'lucide-react';
import dummyBiocompute from '@/data/dummy_biocompute.json';

interface TokenGate {
  enabled: boolean;
  tokenId: string;
  minAmount: number;
}

interface Process {
  id: string;
  name: string;
  type: string;
  public: boolean;
  created_at: number;
  spikes: any[];
  memories: any[];
  tokenGate?: TokenGate;
}

// For demo, assume current user owns all five biocompute processes
const ownedProcessIds = ['bio1', 'bio2', 'bio3', 'bio4', 'bio5'];

export function MyBiocomputePage() {
  const { t } = useTranslation();
  const [myProcesses, setMyProcesses] = useState<Process[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Process> & { tokenGate?: TokenGate }>({});

  useEffect(() => {
    const owned = (dummyBiocompute as Process[]).filter(p => ownedProcessIds.includes(p.id));
    setMyProcesses(owned);
  }, []);

  const startEditing = (process: Process) => {
    setEditingId(process.id);
    setEditForm({
      name: process.name,
      public: process.public,
      tokenGate: process.tokenGate ? { ...process.tokenGate } : undefined,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleSave = (processId: string) => {
    setMyProcesses(prev =>
      prev.map(p =>
        p.id === processId
          ? {
              ...p,
              name: editForm.name || p.name,
              public: editForm.public ?? p.public,
              tokenGate: editForm.tokenGate,
            }
          : p
      )
    );
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (processId: string) => {
    if (confirm(t('biocompute.delete_confirm'))) {
      setMyProcesses(prev => prev.filter(p => p.id !== processId));
      if (editingId === processId) setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('biocompute.my_biocompute')}</h1>
        <Button asChild>
          <Link to="/biocompute/spawn">{t('biocompute.spawn_new')}</Link>
        </Button>
      </div>

      {myProcesses.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">{t('biocompute.no_my_processes')}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myProcesses.map(process => {
          const isEditing = editingId === process.id;

          return (
            <Card key={process.id} className="hover:shadow-lg transition-shadow">
              {isEditing ? (
                // Edit Mode
                <>
                  <CardHeader className="p-4 pb-2">
                    <Input
                      value={editForm.name || ''}
                      onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                      placeholder={t('biocompute.process_name')}
                      className="font-semibold"
                    />
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`public-${process.id}`}>{t('biocompute.public')}</Label>
                      <Switch
                        id={`public-${process.id}`}
                        checked={editForm.public ?? false}
                        onCheckedChange={checked => setEditForm({ ...editForm, public: checked })}
                      />
                    </div>

                    {editForm.public && (
                      <>
                        <div className="flex items-center justify-between pt-2">
                          <Label htmlFor={`tokenGate-${process.id}`}>{t('biocompute.token_gate')}</Label>
                          <Switch
                            id={`tokenGate-${process.id}`}
                            checked={editForm.tokenGate?.enabled ?? false}
                            onCheckedChange={checked =>
                              setEditForm({
                                ...editForm,
                                tokenGate: { enabled: checked, tokenId: 'AOS', minAmount: 0 },
                              })
                            }
                          />
                        </div>

                        {editForm.tokenGate?.enabled && (
                          <div className="space-y-4 border-l-2 pl-4 border-primary/30">
                            <div className="space-y-2">
                              <Label htmlFor={`tokenId-${process.id}`}>{t('biocompute.token_id')}</Label>
                              <Select
                                value={editForm.tokenGate.tokenId}
                                onValueChange={val =>
                                  setEditForm({
                                    ...editForm,
                                    tokenGate: { ...editForm.tokenGate!, tokenId: val },
                                  })
                                }
                              >
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
                              <Label htmlFor={`tokenAmount-${process.id}`}>{t('biocompute.min_amount')}</Label>
                              <Input
                                id={`tokenAmount-${process.id}`}
                                type="number"
                                min="0"
                                step="0.01"
                                value={editForm.tokenGate.minAmount}
                                onChange={e =>
                                  setEditForm({
                                    ...editForm,
                                    tokenGate: {
                                      ...editForm.tokenGate!,
                                      minAmount: parseFloat(e.target.value) || 0,
                                    },
                                  })
                                }
                              />
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" size="sm" onClick={cancelEditing} className="flex-1">
                      <X className="mr-2 h-4 w-4" /> {t('common.cancel')}
                    </Button>
                    <Button size="sm" onClick={() => handleSave(process.id)} className="flex-1">
                      <Check className="mr-2 h-4 w-4" /> {t('common.save')}
                    </Button>
                  </CardFooter>
                </>
              ) : (
                // View Mode
                <>
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
                      <span>{process.memories.length} memories</span>
                      <span>•</span>
                      {process.public ? (
                        <Globe className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t('biocompute.created')} {new Date(process.created_at).toLocaleDateString()}
                    </p>
                    {process.tokenGate?.enabled && (
                      <div className="mt-2 inline-flex items-center gap-1 text-xs bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                        <Lock className="h-3 w-3" />
                        {t('biocompute.token_gated_short', {
                          amount: process.tokenGate.minAmount,
                          token: process.tokenGate.tokenId,
                        })}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button asChild className="flex-1" variant="outline">
                      <Link to="/biocompute/process/$processId" params={{ processId: process.id }}><Eye className="mr-2 h-4 w-4" /> View </Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => startEditing(process)}
                      className="flex-1"
                    >
                      <Edit className="mr-2 h-4 w-4" /> {t('biocompute.edit')}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(process.id)}
                      className="flex-1"
                    >
                      <Trash2 className="mr-2 h-4 w-4" /> {t('biocompute.delete')}
                    </Button>
                  </CardFooter>
                </>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}