import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function CreateAdForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState<'personal' | 'business'>('personal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [category, setCategory] = useState('');
  const [paymentModel, setPaymentModel] = useState<'PPV' | 'PPC'>('PPV');
  const [paymentToken, setPaymentToken] = useState('AOS');
  const [totalAmount, setTotalAmount] = useState('');
  const [targetViews, setTargetViews] = useState('');
  const [businessId, setBusinessId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submission
    console.log({
      ad_type: type,
      business_id: type === 'business' ? businessId : undefined,
      title,
      description,
      target_url: targetUrl,
      category,
      payment_model: paymentModel,
      payment_token: paymentToken,
      total_amount: parseFloat(totalAmount),
      target_views: parseInt(targetViews),
    });
    alert('Ad created (demo)');
    navigate({ to: '/store/ads' });
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('store.create_ad')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Ad Type *</Label>
            <Select required value={type} onValueChange={(val: any) => setType(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === 'business' && (
            <div className="space-y-2">
              <Label htmlFor="businessId">Business ID *</Label>
              <Input id="businessId" required value={businessId} onChange={(e) => setBusinessId(e.target.value)} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetUrl">Target URL *</Label>
            <Input id="targetUrl" type="url" required value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select required value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="gaming">Gaming</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="social">Social</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentModel">Payment Model *</Label>
            <Select required value={paymentModel} onValueChange={(val: any) => setPaymentModel(val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PPV">Pay Per View (PPV)</SelectItem>
                <SelectItem value="PPC">Pay Per Click (PPC)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="paymentToken">Payment Token *</Label>
            <Select required value={paymentToken} onValueChange={setPaymentToken}>
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
            <Label htmlFor="totalAmount">Total Budget *</Label>
            <Input id="totalAmount" type="number" step="0.01" required value={totalAmount} onChange={(e) => setTotalAmount(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetViews">Target Views *</Label>
            <Input id="targetViews" type="number" required value={targetViews} onChange={(e) => setTargetViews(e.target.value)} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/store/ads' })}>
            Cancel
          </Button>
          <Button type="submit">Create Ad</Button>
        </CardFooter>
      </form>
    </Card>
  );
}