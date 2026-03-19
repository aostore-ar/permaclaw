import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { PlusCircle, TrendingUp, Target, MousePointer } from 'lucide-react';
import dummyAds from '@/data/dummy_ads.json';

// Define Ad type
interface Ad {
  id: string;
  title: string;
  status: string;
  impressions: number;
  clicks: number;
  ctr: number;
  budget?: number;
  spent?: number;
}

export function AdsDashboard() {
  const { t } = useTranslation();
  const [ads, setAds] = useState<Ad[]>([]);

  useEffect(() => {
    // Load dummy ads
    setAds(dummyAds as Ad[]);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('store.ads_dashboard')}</h1>
        <Button asChild>
          <Link to="/store/ads/create">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('store.create_ad')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.active_ads')}</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.total_impressions')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.reduce((acc, ad) => acc + ad.impressions, 0)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.total_clicks')}</CardTitle>
            <MousePointer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ads.reduce((acc, ad) => acc + ad.clicks, 0)}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {ads.map(ad => (
          <Card key={ad.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{ad.title}</h3>
                  <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                    <span>{t('store.status')}: {ad.status}</span>
                    <span>{t('store.impressions')}: {ad.impressions}</span>
                    <span>{t('store.clicks')}: {ad.clicks}</span>
                    <span>CTR: {ad.ctr.toFixed(2)}%</span>
                    {ad.budget && <span>{t('store.budget')}: ${ad.budget}</span>}
                    {ad.spent && <span>{t('store.spent')}: ${ad.spent}</span>}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                <Link to="/store/ads/$id" params={{ id: ad.id }}>{t('store.view_details')} </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}