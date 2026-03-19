import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '../../components/ui/badge';
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
import { Link } from '@tanstack/react-router';
import {
  PlusCircle, DollarSign, Users, Eye, MousePointer,
  Star, MessageSquare, Edit, ChevronDown, ChevronUp,
  BarChart3, Save, X, TrendingUp, Trash2
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Import dummy data
import dummyData from '@/data/dummy_data_dappowner.json';

// Types
interface DailyStat {
  date: string;
  impressions: number;
  clicks: number;
  earnings: number;
}

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
  reply: string | null;
}

interface DApp {
  id: string;
  name: string;
  description: string;
  category: string;
  product_type: string;
  earnings: number;
  subscribers: number;
  impressions: number;
  clicks: number;
  dailyStats: DailyStat[];
  reviews: Review[];
}

export function OwnerDashboard() {
  const { t } = useTranslation();
  const [dapps, setDapps] = useState<DApp[]>([]);

  // Compute owner stats from current dapps
  const ownerStats = {
    totalEarnings: dapps.reduce((sum, d) => sum + d.earnings, 0),
    totalSubscribers: dapps.reduce((sum, d) => sum + d.subscribers, 0),
    totalImpressions: dapps.reduce((sum, d) => sum + d.impressions, 0),
  };

  // UI state
  const [expandedReviews, setExpandedReviews] = useState<Record<string, boolean>>({});
  const [expandedAnalytics, setExpandedAnalytics] = useState<Record<string, boolean>>({});
  const [editingDapp, setEditingDapp] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<DApp>>({});
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [sendingReply, setSendingReply] = useState<Record<string, boolean>>({});
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; dappId: string | null }>({
    open: false,
    dappId: null,
  });
  const [deleting, setDeleting] = useState(false);

  // Load dummy data
  useEffect(() => {
    setDapps(dummyData.dapps);
  }, []);

  // Toggle functions
  const toggleReviews = (dappId: string) => {
    setExpandedReviews(prev => ({ ...prev, [dappId]: !prev[dappId] }));
  };

  const toggleAnalytics = (dappId: string) => {
    setExpandedAnalytics(prev => ({ ...prev, [dappId]: !prev[dappId] }));
  };

  // Edit functions
  const startEditing = (dapp: DApp) => {
    setEditingDapp(dapp.id);
    setEditFormData({
      name: dapp.name,
      description: dapp.description,
      category: dapp.category,
      product_type: dapp.product_type,
    });
  };

  const cancelEditing = () => {
    setEditingDapp(null);
    setEditFormData({});
  };

  const saveEditing = (dappId: string) => {
    // Simulate API call
    setDapps(prevDapps =>
      prevDapps.map(dapp =>
        dapp.id === dappId
          ? { ...dapp, ...editFormData }
          : dapp
      )
    );
    setEditingDapp(null);
    setEditFormData({});
  };

  const handleEditChange = (field: keyof DApp, value: string) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Delete functions
  const openDeleteDialog = (dappId: string) => {
    setDeleteDialog({ open: true, dappId });
  };

  const closeDeleteDialog = () => {
    setDeleteDialog({ open: false, dappId: null });
  };

  const confirmDelete = () => {
    if (!deleteDialog.dappId) return;
    setDeleting(true);

    // Simulate API call
    setTimeout(() => {
      setDapps(prev => prev.filter(d => d.id !== deleteDialog.dappId));
      setDeleting(false);
      closeDeleteDialog();
      // Close any expanded sections for this dapp
      setExpandedReviews(prev => {
        const newState = { ...prev };
        delete newState[deleteDialog.dappId!];
        return newState;
      });
      setExpandedAnalytics(prev => {
        const newState = { ...prev };
        delete newState[deleteDialog.dappId!];
        return newState;
      });
      if (editingDapp === deleteDialog.dappId) {
        setEditingDapp(null);
        setEditFormData({});
      }
    }, 800);
  };

  // Review reply functions
  const handleReplyChange = (reviewId: string, text: string) => {
    setReplyText(prev => ({ ...prev, [reviewId]: text }));
  };

  const submitReply = (dappId: string, reviewId: string) => {
    if (!replyText[reviewId]?.trim()) return;

    setSendingReply(prev => ({ ...prev, [reviewId]: true }));

    // Simulate API call
    setTimeout(() => {
      setDapps(prevDapps =>
        prevDapps.map(dapp =>
          dapp.id === dappId
            ? {
                ...dapp,
                reviews: dapp.reviews.map(review =>
                  review.id === reviewId
                    ? { ...review, reply: replyText[reviewId] }
                    : review
                )
              }
            : dapp
        )
      );
      setReplyText(prev => ({ ...prev, [reviewId]: '' }));
      setSendingReply(prev => ({ ...prev, [reviewId]: false }));
    }, 800);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const productTypes = ['Website DApp', 'Mobile DApp', 'Device', 'Project'];

  return (
    <div className="space-y-6">
      {/* Header with Create button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('store.owner_dashboard')}</h1>
        <Button asChild>
          <Link to="/store/create">
            <PlusCircle className="mr-2 h-4 w-4" /> {t('store.create_dapp')}
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.total_earnings')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${ownerStats.totalEarnings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.total_subscribers')}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerStats.totalSubscribers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('store.total_impressions')}</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ownerStats.totalImpressions.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs: My DApps and Reviews Management */}
      <Tabs defaultValue="dapps">
        <TabsList>
          <TabsTrigger value="dapps">{t('store.my_dapps')}</TabsTrigger>
          <TabsTrigger value="reviews">{t('store.reviews_management')}</TabsTrigger>
        </TabsList>

        {/* My DApps Tab */}
        <TabsContent value="dapps" className="space-y-4">
          {dapps.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center text-muted-foreground">
                {t('store.no_dapps')}
              </CardContent>
            </Card>
          ) : (
            dapps.map(dapp => (
              <Card key={dapp.id}>
                <CardContent className="p-6">
                  {/* Main row: info and action buttons */}
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                    <div className="flex-1">
                      {editingDapp === dapp.id ? (
                        // Inline edit form
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor={`name-${dapp.id}`}>Name</Label>
                            <Input
                              id={`name-${dapp.id}`}
                              value={editFormData.name || ''}
                              onChange={(e) => handleEditChange('name', e.target.value)}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`desc-${dapp.id}`}>Description</Label>
                            <Textarea
                              id={`desc-${dapp.id}`}
                              value={editFormData.description || ''}
                              onChange={(e) => handleEditChange('description', e.target.value)}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`cat-${dapp.id}`}>Category</Label>
                              <Input
                                id={`cat-${dapp.id}`}
                                value={editFormData.category || ''}
                                onChange={(e) => handleEditChange('category', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label htmlFor={`type-${dapp.id}`}>Product Type</Label>
                              <Select
                                value={editFormData.product_type}
                                onValueChange={(val) => handleEditChange('product_type', val)}
                              >
                                <SelectTrigger id={`type-${dapp.id}`}>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {productTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => saveEditing(dapp.id)}>
                              <Save className="h-4 w-4 mr-2" /> Save
                            </Button>
                            <Button size="sm" variant="outline" onClick={cancelEditing}>
                              <X className="h-4 w-4 mr-2" /> Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // Normal display
                        <>
                          <h3 className="text-xl font-semibold">{dapp.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{dapp.description}</p>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
                            <span className="flex items-center"><DollarSign className="h-4 w-4 mr-1" />{t('store.earnings')}: ${dapp.earnings}</span>
                            <span className="flex items-center"><Users className="h-4 w-4 mr-1" />{t('store.subscribers')}: {dapp.subscribers}</span>
                            <span className="flex items-center"><Eye className="h-4 w-4 mr-1" />{t('store.impressions')}: {dapp.impressions}</span>
                            <span className="flex items-center"><MousePointer className="h-4 w-4 mr-1" />{t('store.clicks')}: {dapp.clicks}</span>
                          </div>
                        </>
                      )}
                    </div>

                    {editingDapp !== dapp.id && (
                      <div className="flex flex-wrap gap-2">
                        <Button variant="outline" size="sm" onClick={() => startEditing(dapp)}>
                          <Edit className="h-4 w-4 mr-2" /> {t('store.edit')}
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(dapp.id)}>
                          <Trash2 className="h-4 w-4 mr-2" /> {t('store.delete')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleAnalytics(dapp.id)}>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          {t('store.analytics')}
                          {expandedAnalytics[dapp.id] ? 
                            <ChevronUp className="h-4 w-4 ml-2" /> : 
                            <ChevronDown className="h-4 w-4 ml-2" />
                          }
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => toggleReviews(dapp.id)}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          {t('store.reviews')} ({dapp.reviews.length})
                          {expandedReviews[dapp.id] ? 
                            <ChevronUp className="h-4 w-4 ml-2" /> : 
                            <ChevronDown className="h-4 w-4 ml-2" />
                          }
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Expandable Analytics Section */}
                  {expandedAnalytics[dapp.id] && (
                    <div className="mt-6 border-t pt-4">
                      <h4 className="font-medium mb-4 flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                        Last 7 days performance
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Impressions & Clicks Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dapp.dailyStats}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                              <YAxis yAxisId="left" />
                              <YAxis yAxisId="right" orientation="right" />
                              <Tooltip />
                              <Legend />
                              <Line yAxisId="left" type="monotone" dataKey="impressions" stroke="#8884d8" name="Impressions" />
                              <Line yAxisId="right" type="monotone" dataKey="clicks" stroke="#82ca9d" name="Clicks" />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Earnings Chart */}
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dapp.dailyStats}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="earnings" fill="#ffc658" name="Earnings ($)" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                      {/* Quick stats summary */}
                      <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                        <div className="bg-muted p-2 rounded text-center">
                          <div className="text-muted-foreground">Avg. daily impressions</div>
                          <div className="font-semibold">
                            {Math.round(dapp.dailyStats.reduce((acc, d) => acc + d.impressions, 0) / dapp.dailyStats.length)}
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded text-center">
                          <div className="text-muted-foreground">Avg. daily clicks</div>
                          <div className="font-semibold">
                            {Math.round(dapp.dailyStats.reduce((acc, d) => acc + d.clicks, 0) / dapp.dailyStats.length)}
                          </div>
                        </div>
                        <div className="bg-muted p-2 rounded text-center">
                          <div className="text-muted-foreground">Avg. daily earnings</div>
                          <div className="font-semibold">
                            ${Math.round(dapp.dailyStats.reduce((acc, d) => acc + d.earnings, 0) / dapp.dailyStats.length)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expandable Reviews Section */}
                  {expandedReviews[dapp.id] && (
                    <div className="mt-6 border-t pt-4 space-y-4">
                      <h4 className="font-medium">{t('store.recent_reviews')}</h4>
                      {dapp.reviews.length === 0 ? (
                        <p className="text-sm text-muted-foreground">{t('store.no_reviews_yet')}</p>
                      ) : (
                        dapp.reviews.map(review => (
                          <div key={review.id} className="bg-muted/50 p-4 rounded-lg">
                            <div className="flex items-start gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback>{review.user.slice(2,4).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-medium">{review.user}</span>
                                  <div className="flex items-center">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                      />
                                    ))}
                                  </div>
                                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                                </div>
                                <p className="text-sm mt-1">{review.comment}</p>
                                {review.reply && (
                                  <div className="mt-2 pl-4 border-l-2 border-primary/30">
                                    <p className="text-xs text-muted-foreground">{t('store.your_reply')}:</p>
                                    <p className="text-sm">{review.reply}</p>
                                  </div>
                                )}
                                {!review.reply && (
                                  <div className="mt-3 space-y-2">
                                    <Textarea
                                      placeholder={t('store.write_reply')}
                                      value={replyText[review.id] || ''}
                                      onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                      className="min-h-[80px] text-sm"
                                    />
                                    <Button
                                      size="sm"
                                      onClick={() => submitReply(dapp.id, review.id)}
                                      disabled={sendingReply[review.id] || !replyText[review.id]?.trim()}
                                    >
                                      {sendingReply[review.id] ? t('store.sending') : t('store.reply')}
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Reviews Management Tab */}
        <TabsContent value="reviews" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('store.all_reviews')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {dapps.flatMap(dapp => 
                dapp.reviews.map(review => ({
                  ...review,
                  dappName: dapp.name,
                  dappId: dapp.id
                }))
              ).length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t('store.no_reviews')}</p>
              ) : (
                dapps.flatMap(dapp => 
                  dapp.reviews.map(review => (
                    <div key={review.id} className="border-b pb-4 last:border-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline">{dapp.name}</Badge>
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3 w-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                          </div>
                          <p className="text-sm mt-2">{review.comment}</p>
                          {review.reply && (
                            <div className="mt-2 pl-4 border-l-2 border-primary/30">
                              <p className="text-xs text-muted-foreground">{t('store.your_reply')}:</p>
                              <p className="text-sm">{review.reply}</p>
                            </div>
                          )}
                          {!review.reply && (
                            <div className="mt-3 space-y-2">
                              <Textarea
                                placeholder={t('store.write_reply')}
                                value={replyText[review.id] || ''}
                                onChange={(e) => handleReplyChange(review.id, e.target.value)}
                                className="min-h-[80px] text-sm"
                              />
                              <Button
                                size="sm"
                                onClick={() => submitReply(dapp.id, review.id)}
                                disabled={sendingReply[review.id] || !replyText[review.id]?.trim()}
                              >
                                {sendingReply[review.id] ? t('store.sending') : t('store.reply')}
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog.open} onOpenChange={(open) => !open && closeDeleteDialog()}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('store.confirm_delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('store.delete_dapp_confirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t('store.cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} disabled={deleting}>
              {deleting ? t('store.deleting') : t('store.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}