import { useEffect, useState } from 'react';
import { useParams, Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { type Product } from '@/api/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReviewsList } from './ReviewsList';
import { AnalyticsChart } from './AnalyticsChart';
import { ArrowLeft, Star, Globe, Calendar, User, Coins, Cpu } from 'lucide-react';
import dummyProducts from '@/data/dummy_products.json';

export function ProductDetailPage() {
  const { id } = useParams({ from: '/store/$id' });
  const { t } = useTranslation();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find product by id from dummy data
    const found = dummyProducts.find(p => p.id === id) as Product | undefined;
    if (found) {
      setProduct(found);
    }
    setLoading(false);
  }, [id]);

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleDateString();
  };

  const productTypeIcon: Record<string, string> = {
    'Website DApp': '🌐',
    'Mobile DApp': '📱',
    'Device': '⚙️',
    'Project': '📦',
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!product) {
    return <div className="text-center py-12">Product not found</div>;
  }

  const isDevice = product.product_type === 'Device';
  const isProject = product.product_type === 'Project';

  // Sample chart data for analytics
  const chartData = [
    { name: 'Mon', value: 12 },
    { name: 'Tue', value: 19 },
    { name: 'Wed', value: 15 },
    { name: 'Thu', value: 22 },
    { name: 'Fri', value: 27 },
    { name: 'Sat', value: 18 },
    { name: 'Sun', value: 14 },
  ];

  return (
    <div className="space-y-6">
      <Link to="/store" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4 mr-1" /> {t('store.back')}
      </Link>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="p-6">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
              {product.logo_url ? (
                <img src={product.logo_url} alt={product.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <span className="text-6xl text-muted-foreground">{productTypeIcon[product.product_type]}</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Type</span>
                <span className="font-medium">{product.product_type}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Category</span>
                <span className="font-medium">{product.category}</span>
              </div>
              {product.sub_category && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Sub‑category</span>
                  <span className="font-medium">{product.sub_category}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Blockchain</span>
                <span className="font-medium">{product.blockchain || 'AO Computer'}</span>
              </div>
              {isProject && product.token_id && (
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Token ID</span>
                  <span className="font-mono text-xs truncate max-w-[150px]">{product.token_id}</span>
                </div>
              )}
            </div>
            {product.website_url && (
              <Button asChild className="w-full mt-6">
                <a href={product.website_url} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-4 w-4 mr-2" /> Visit Website
                </a>
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <div className="flex items-center">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{product.rating?.toFixed(1)}</span>
                <span className="ml-1">({product.reviews_count} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(product.timestamp)}
              </div>
              <span>•</span>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {product.owner?.slice(0, 8)}...
              </div>
            </div>
            <p className="mt-4 text-lg">{product.description}</p>
          </div>

          <Tabs defaultValue="info">
            <TabsList>
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              {!isDevice && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
            </TabsList>
            <TabsContent value="info" className="mt-4">
              <Card>
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold">About</h3>
                  <p className="text-muted-foreground">{product.description}</p>
                  <h3 className="font-semibold">Details</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Blockchain:</strong> {product.blockchain || 'AO Computer'}</li>
                    <li><strong>Owner:</strong> {product.owner}</li>
                    <li><strong>Category:</strong> {product.category}{product.sub_category ? ` / ${product.sub_category}` : ''}</li>
                    {isDevice && <li><strong>Referral fee:</strong> {(product.referral_fee! * 100).toFixed(1)}%</li>}
                    {isProject && <li><strong>Token ID:</strong> {product.token_id}</li>}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <ReviewsList productId={product.id} />
                </CardContent>
              </Card>
            </TabsContent>
            {!isDevice && (
              <TabsContent value="analytics" className="mt-4">
                <Card>
                  <CardContent className="p-6">
                    <AnalyticsChart data={chartData} title="Weekly Activity" />
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>

          {isDevice && (
            <Button size="lg" className="w-full md:w-auto">
              <Cpu className="h-4 w-4 mr-2" /> Install Device
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}