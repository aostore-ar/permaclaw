import type { Product } from '@/api/store';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';
import { Link } from '@tanstack/react-router';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const productTypeIcons: Record<string, string> = {
    'Website DApp': '🌐',
    'Mobile DApp': '📱',
    'Device': '⚙️',
    'Project': '📦',
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted flex items-center justify-center p-4">
        {product.logo_url ? (
          <img src={product.logo_url} alt={product.name} className="max-h-full max-w-full object-contain" />
        ) : (
          <div className="text-4xl text-muted-foreground">{productTypeIcons[product.product_type] || '🔹'}</div>
        )}
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold line-clamp-1">{product.name}</h3>
          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
            {product.product_type}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
          {product.description}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="ml-1 text-sm font-medium">{product.rating?.toFixed(1) || '0.0'}</span>
          </div>
          <span className="text-xs text-muted-foreground">
            ({product.reviews_count || 0} reviews)
          </span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full ml-auto">
            {product.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
            <Link to="/store/$id" params={{ id: product.id }}> View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}