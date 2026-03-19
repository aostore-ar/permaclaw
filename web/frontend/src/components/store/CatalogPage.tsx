import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from './ProductCard';
import { type Product } from '@/api/store';
import { Search } from 'lucide-react';
import dummyProducts from '@/data/dummy_products.json';

export function CatalogPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'rating' | 'newest'>('name');

  useEffect(() => {
    // Load dummy data
    setProducts(dummyProducts as Product[]);
    setFiltered(dummyProducts as Product[]);
  }, []);

  useEffect(() => {
    let result = [...products];

    // Filter by type
    if (typeFilter !== 'all') {
      result = result.filter(p => p.product_type === typeFilter);
    }

    // Filter by search
    if (search) {
      const term = search.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.description.toLowerCase().includes(term)
      );
    }

    // Sort
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    }

    setFiltered(result);
  }, [products, search, typeFilter, sortBy]);

  const productTypes = ['all', 'Website DApp', 'Mobile DApp', 'Device', 'Project'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t('store.catalog')}</h1>
        <Button asChild>
          <a href="/store/create">{t('store.create')}</a>
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('store.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('store.filter_type')} />
          </SelectTrigger>
          <SelectContent>
            {productTypes.map(type => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? t('store.all_types') : type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('store.sort_by')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t('store.sort_name')}</SelectItem>
            <SelectItem value="rating">{t('store.sort_rating')}</SelectItem>
            <SelectItem value="newest">{t('store.sort_newest')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          {t('store.no_products')}
        </div>
      )}
    </div>
  );
}