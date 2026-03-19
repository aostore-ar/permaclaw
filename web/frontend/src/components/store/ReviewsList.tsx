import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  username: string;
  rating: number;
  description: string;
  createdTime: number;
}

interface ReviewsListProps {
  productId: string;
}

// Dummy reviews
const dummyReviews: Review[] = [
  {
    id: 'r1',
    username: 'Alice',
    rating: 5,
    description: 'Amazing DApp! Very easy to use and the team is super responsive.',
    createdTime: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'r2',
    username: 'Bob',
    rating: 4,
    description: 'Good functionality but could use more features. Overall happy.',
    createdTime: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
  {
    id: 'r3',
    username: 'Charlie',
    rating: 5,
    description: 'The best DeFi experience on AO. Highly recommend!',
    createdTime: Date.now() - 10 * 24 * 60 * 60 * 1000,
  },
];

export function ReviewsList({ productId }: ReviewsListProps) {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    // Simulate fetch
    setReviews(dummyReviews);
  }, [productId]);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (reviews.length === 0) {
    return <p className="text-center text-muted-foreground py-4">{t('store.no_reviews')}</p>;
  }

  return (
    <div className="space-y-4">
      {reviews.map(review => (
        <div key={review.id} className="border-b pb-4 last:border-0">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{review.username[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{review.username}</h4>
                <span className="text-sm text-muted-foreground">{formatDate(review.createdTime)}</span>
              </div>
              <div className="flex items-center my-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
                  />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{review.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}