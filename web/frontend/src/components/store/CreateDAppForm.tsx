import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function CreateDAppForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [blockchain, setBlockchain] = useState('AO Computer');
  const [website, setWebsite] = useState('');
  const [logo, setLogo] = useState('');
  const [referralFee, setReferralFee] = useState('0.02');
  const [tokenId, setTokenId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Dummy submission
    console.log({
      type,
      name,
      description,
      category,
      blockchain,
      website,
      logo,
      referralFee: type !== 'Project' ? parseFloat(referralFee) : undefined,
      tokenId: type === 'Project' ? tokenId : undefined,
    });
    alert('Product created (demo)');
    navigate({ to: '/store' });
  };

  const isDApp = type === 'Website DApp' || type === 'Mobile DApp';
  const isDevice = type === 'Device';
  const isProject = type === 'Project';

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{t('store.create_title')}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="type">Product Type *</Label>
            <Select required value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Website DApp">Website DApp</SelectItem>
                <SelectItem value="Mobile DApp">Mobile DApp</SelectItem>
                <SelectItem value="Device">Device</SelectItem>
                <SelectItem value="Project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Product Name *</Label>
            <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" required value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input id="category" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., DeFi, Gaming, Social" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="blockchain">Blockchain *</Label>
            <Select required value={blockchain} onValueChange={setBlockchain}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AO Computer">AO Computer</SelectItem>
                <SelectItem value="Arweave Mainnet">Arweave Mainnet</SelectItem>
                <SelectItem value="Ethereum">Ethereum</SelectItem>
                <SelectItem value="Solana">Solana</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="website">Website URL</Label>
            <Input id="website" type="url" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Logo URL</Label>
            <Input id="logo" type="url" value={logo} onChange={(e) => setLogo(e.target.value)} />
          </div>

          {(isDApp || isDevice) && (
            <div className="space-y-2">
              <Label htmlFor="referralFee">Referral Fee (tokens) *</Label>
              <Input
                id="referralFee"
                type="number"
                step="0.001"
                min="0"
                required={isDApp || isDevice}
                value={referralFee}
                onChange={(e) => setReferralFee(e.target.value)}
              />
            </div>
          )}

          {isProject && (
            <div className="space-y-2">
              <Label htmlFor="tokenId">Token ID *</Label>
              <Input id="tokenId" required value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => navigate({ to: '/store' })}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </CardFooter>
      </form>
    </Card>
  );
}