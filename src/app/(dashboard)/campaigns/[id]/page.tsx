"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Users, Calendar, Activity, Edit3, Save, X, MessageSquare, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientOnly from '@/components/ClientOnly';
import { useToast } from '@/components/ui/use-toast';

interface Campaign {
  id: string;
  name: string;
  channel: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  leads: number;
  created_at: string;
  last_run: string;
  description?: string;
  target_audience?: string;
  budget?: number;
  conversion_rate?: number;
  messages_sent?: number;
  responses_received?: number;
  revenue_generated?: number;
}

export default function CampaignDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedCampaign, setEditedCampaign] = useState<Partial<Campaign>>({});

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCampaign: Campaign = {
      id: params.id as string,
      name: "Q1 SaaS Outreach Campaign",
      channel: "LinkedIn",
      status: 'active',
      leads: 150,
      created_at: "2024-01-15T10:00:00Z",
      last_run: "2024-01-20T14:30:00Z",
      description: "Targeted outreach campaign for SaaS companies in the B2B space. Focus on decision makers in marketing and sales roles.",
      target_audience: "B2B SaaS companies, Marketing/Sales decision makers",
      budget: 5000,
      conversion_rate: 12.5,
      messages_sent: 450,
      responses_received: 67,
      revenue_generated: 25000
    };

    setCampaign(mockCampaign);
    setEditedCampaign(mockCampaign);
    setIsLoading(false);
  }, [params.id]);

  const handleSave = async () => {
    // TODO: Implement actual save logic
    setCampaign(prev => prev ? { ...prev, ...editedCampaign } : null);
    setIsEditing(false);
    toast({
      title: t('campaigns.campaignUpdated'),
      description: t('campaigns.campaignUpdatedSuccessfully')
    });
  };

  const handleCancel = () => {
    setEditedCampaign(campaign || {});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            <ClientOnly fallback="Campaign not found">
              {t('campaigns.campaignNotFound')}
            </ClientOnly>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                aria-label="Go back"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-medium text-foreground">
                  {isEditing ? (
                    <Input
                      value={editedCampaign.name || ''}
                      onChange={(e) => setEditedCampaign(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-medium border-none p-0 h-auto bg-transparent"
                    />
                  ) : (
                    campaign.name
                  )}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Target className="w-3 h-3" />
                  {isEditing ? (
                    <Input
                      value={editedCampaign.channel || ''}
                      onChange={(e) => setEditedCampaign(prev => ({ ...prev, channel: e.target.value }))}
                      className="text-sm border-none p-0 h-auto bg-transparent w-32"
                    />
                  ) : (
                    campaign.channel
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    aria-label="Save changes"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    <ClientOnly fallback="Save">
                      {t('common.save')}
                    </ClientOnly>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCancel}
                    aria-label="Cancel editing"
                  >
                    <X className="w-4 h-4 mr-2" />
                    <ClientOnly fallback="Cancel">
                      {t('common.cancel')}
                    </ClientOnly>
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  aria-label="Edit campaign"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Edit">
                    {t('common.edit')}
                  </ClientOnly>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <ClientOnly fallback="Description">
                  {t('campaigns.description')}
                </ClientOnly>
              </h2>
              {isEditing ? (
                <Textarea
                  value={editedCampaign.description || ''}
                  onChange={(e) => setEditedCampaign(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter campaign description..."
                  className="min-h-[120px] border-none bg-transparent p-0 resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {campaign.description || t('campaigns.noDescription')}
                </p>
              )}
            </Card>

            {/* Target Audience */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Users className="w-4 h-4" />
                <ClientOnly fallback="Target Audience">
                  {t('campaigns.targetAudience')}
                </ClientOnly>
              </h2>
              {isEditing ? (
                <Input
                  value={editedCampaign.target_audience || ''}
                  onChange={(e) => setEditedCampaign(prev => ({ ...prev, target_audience: e.target.value }))}
                  placeholder="Enter target audience..."
                  className="border-none bg-transparent p-0"
                />
              ) : (
                <p className="text-muted-foreground">
                  {campaign.target_audience || t('campaigns.noTargetAudience')}
                </p>
              )}
            </Card>

            {/* Performance Metrics */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <ClientOnly fallback="Performance Metrics">
                  {t('campaigns.performanceMetrics')}
                </ClientOnly>
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{campaign.messages_sent || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    <ClientOnly fallback="Messages Sent">
                      {t('campaigns.messagesSent')}
                    </ClientOnly>
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{campaign.responses_received || 0}</p>
                  <p className="text-sm text-muted-foreground">
                    <ClientOnly fallback="Responses Received">
                      {t('campaigns.responsesReceived')}
                    </ClientOnly>
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">{campaign.conversion_rate || 0}%</p>
                  <p className="text-sm text-muted-foreground">
                    <ClientOnly fallback="Conversion Rate">
                      {t('campaigns.conversionRate')}
                    </ClientOnly>
                  </p>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-foreground">${(campaign.revenue_generated || 0).toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">
                    <ClientOnly fallback="Revenue Generated">
                      {t('campaigns.revenueGenerated')}
                    </ClientOnly>
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Status">
                  {t('campaigns.status')}
                </ClientOnly>
              </h3>
              {isEditing ? (
                <Select
                  value={editedCampaign.status || campaign.status}
                  onValueChange={(value) => setEditedCampaign(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">
                      <ClientOnly fallback="Draft">
                        {t('campaigns.draft')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="active">
                      <ClientOnly fallback="Active">
                        {t('campaigns.active')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="paused">
                      <ClientOnly fallback="Paused">
                        {t('campaigns.paused')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="completed">
                      <ClientOnly fallback="Completed">
                        {t('campaigns.completed')}
                      </ClientOnly>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(campaign.status)}`}></div>
                  <Badge variant="outline">
                    <ClientOnly fallback={campaign.status}>
                      {t(`campaigns.${campaign.status}`)}
                    </ClientOnly>
                  </Badge>
                </div>
              )}
            </Card>

            {/* Campaign Details */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Campaign Details">
                  {t('campaigns.campaignDetails')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Leads">
                        {t('campaigns.leads')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedCampaign.leads || 0}
                        onChange={(e) => setEditedCampaign(prev => ({ ...prev, leads: Number(e.target.value) }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{campaign.leads}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Budget">
                        {t('campaigns.budget')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={editedCampaign.budget || 0}
                        onChange={(e) => setEditedCampaign(prev => ({ ...prev, budget: Number(e.target.value) }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">${(campaign.budget || 0).toLocaleString()}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Conversion Rate">
                        {t('campaigns.conversionRate')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={editedCampaign.conversion_rate || 0}
                        onChange={(e) => setEditedCampaign(prev => ({ ...prev, conversion_rate: Number(e.target.value) }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{(campaign.conversion_rate || 0)}%</p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Activity">
                  {t('campaigns.activity')}
                </ClientOnly>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Created">
                        {t('campaigns.created')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(campaign.created_at)}</p>
                  </div>
                </div>
                {campaign.last_run && (
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Last Run">
                          {t('campaigns.lastRun')}
                        </ClientOnly>
                      </p>
                      <p className="text-foreground">{formatDate(campaign.last_run)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Quick Actions">
                  {t('campaigns.quickActions')}
                </ClientOnly>
              </h3>
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement start campaign action
                  }}
                >
                  <Activity className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Start Campaign">
                    {t('campaigns.startCampaign')}
                  </ClientOnly>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement pause campaign action
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Pause Campaign">
                    {t('campaigns.pauseCampaign')}
                  </ClientOnly>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 