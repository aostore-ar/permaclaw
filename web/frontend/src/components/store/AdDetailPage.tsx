import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ArrowLeft, Eye, MousePointer, Edit, Save, X, Trash2 } from 'lucide-react';
import dummyAds from '@/data/dummy_ads.json';

interface Ad {
  id: string;
  title: string;
  description: string;
  target_url: string;
  image_url?: string;
  category: string;
  ad_type: string;
  payment_model: string;
  payment_token: string;
  total_amount: number;
  net_amount: number;
  target_views: number;
  remaining_views: number;
  impressions: number;
  clicks: number;
  ctr: number;
  status: string;
  created_at: number;
  business_id: string | null;
}

export function AdDetailPage() {
  const { id } = useParams({ from: '/store/ads/$id' });
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [ad, setAd] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Ad>>({});
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load ad data
  useEffect(() => {
    const found = dummyAds.find(a => a.id === id) as Ad | undefined;
    setAd(found || null);
    setLoading(false);
  }, [id]);

  // Initialize edit form when starting to edit
  const startEditing = () => {
    if (!ad) return;
    setEditFormData({
      title: ad.title,
      description: ad.description,
      target_url: ad.target_url,
      category: ad.category,
      ad_type: ad.ad_type,
    });
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setEditFormData({});
  };

  const handleEditChange = (field: keyof Ad, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const saveEditing = () => {
    if (!ad) return;
    setSaving(true);

    // Simulate API call
    setTimeout(() => {
      // Update the ad in state
      setAd(prev => prev ? { ...prev, ...editFormData } : null);
      setEditing(false);
      setEditFormData({});
      setSaving(false);
    }, 800);
  };

  const handleDelete = () => {
    if (!ad) return;
    setDeleting(true);

    // Simulate API call
    setTimeout(() => {
      // In a real app, you'd call an API to delete
      // Then navigate back to ads list
      setDeleting(false);
      setDeleteDialogOpen(false);
      navigate({ to: '/store/ads' });
    }, 800);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!ad) {
    return <div className="text-center py-12">Ad not found</div>;
  }

  const ctr = ((ad.clicks / ad.impressions) * 100).toFixed(2);

  // Editable fields configuration (for demonstration)
  const categories = ['defi', 'gaming', 'wallet', 'nft', 'social', 'other'];
  const adTypes = ['banner', 'video', 'native', 'popup'];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link to="/store/ads" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('store.back_to_ads')}
      </Link>

      {/* Header with actions */}
      <div className="flex justify-between items-start">
        <h1 className="text-3xl font-bold">
          {editing ? (
            <Input
              value={editFormData.title || ''}
              onChange={(e) => handleEditChange('title', e.target.value)}
              className="text-3xl font-bold h-auto py-1 px-2"
            />
          ) : (
            ad.title
          )}
        </h1>
        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button variant="outline" onClick={startEditing}>
                <Edit className="h-4 w-4 mr-2" /> {t('store.edit')}
              </Button>
              <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" /> {t('store.delete')}
              </Button>
            </>
          ) : (
            <>
              <Button onClick={saveEditing} disabled={saving}>
                {saving ? t('store.saving') : <><Save className="h-4 w-4 mr-2" /> {t('store.save')}</>}
              </Button>
              <Button variant="outline" onClick={cancelEditing} disabled={saving}>
                <X className="h-4 w-4 mr-2" /> {t('store.cancel')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Stats Cards (always visible) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('store.impressions')}</p>
              <p className="text-2xl font-bold">{ad.impressions}</p>
            </div>
            <Eye className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('store.clicks')}</p>
              <p className="text-2xl font-bold">{ad.clicks}</p>
            </div>
            <MousePointer className="h-8 w-8 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">CTR</p>
              <p className="text-2xl font-bold">{ctr}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{t('store.remaining_views')}</p>
              <p className="text-2xl font-bold">{ad.remaining_views}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ad Details Card */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">{t('store.ad_details')}</h2>

          {editing ? (
            // Edit form
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="description">{t('store.description')}</Label>
                <Textarea
                  id="description"
                  value={editFormData.description || ''}
                  onChange={(e) => handleEditChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="target_url">{t('store.target_url')}</Label>
                <Input
                  id="target_url"
                  value={editFormData.target_url || ''}
                  onChange={(e) => handleEditChange('target_url', e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="category">{t('store.category')}</Label>
                <Select
                  value={editFormData.category}
                  onValueChange={(val) => handleEditChange('category', val)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="ad_type">{t('store.ad_type')}</Label>
                <Select
                  value={editFormData.ad_type}
                  onValueChange={(val) => handleEditChange('ad_type', val)}
                >
                  <SelectTrigger id="ad_type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {adTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            // Read-only details
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t('store.description')}</p>
                <p>{ad.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.target_url')}</p>
                <a href={ad.target_url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                  {ad.target_url}
                </a>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.category')}</p>
                <p className="capitalize">{ad.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.ad_type')}</p>
                <p className="capitalize">{ad.ad_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.payment_model')}</p>
                <p>{ad.payment_model}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.payment_token')}</p>
                <p>{ad.payment_token}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.budget')}</p>
                <p>{ad.total_amount} {ad.payment_token}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.net_amount')}</p>
                <p>{ad.net_amount} {ad.payment_token}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.created')}</p>
                <p>{new Date(ad.created_at).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t('store.status')}</p>
                <p className="capitalize">{ad.status}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('store.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('store.delete_ad_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t('store.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting}>
              {deleting ? t('store.deleting') : t('store.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}