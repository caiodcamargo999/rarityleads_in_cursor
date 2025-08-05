"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Building, Mail, Phone, MapPin, Calendar, Edit3, Save, X, MessageSquare, Target, Activity, Clock, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientOnly from '@/components/ClientOnly';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';

interface Lead {
  id: string;
  user_id?: string;
  full_name: string;
  company_name: string;
  email: string;
  job_title?: string;
  phone?: string;
  location?: string;
  source?: string;
  status?: 'to_contact' | 'contacted' | 'in_conversation' | 'closed';
  priority?: 'low' | 'medium' | 'high';
  tags?: string[];
  notes?: string;
  best_contact_time?: string;
  suggested_services?: string[];
  created_at: string;
  updated_at?: string;
  last_contact_date?: string;
  next_follow_up?: string;
  whatsapp?: string;
  website?: string;
  social?: string;
}

export default function LeadDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  // Fetch lead data
  useEffect(() => {
    const fetchLead = async () => {
      if (!params.id) return;
      
      try {
        const { data, error } = await supabase
          .from('leads')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) {
          console.error('Error fetching lead:', error);
          toast({
            title: t('common.error'),
            description: t('leads.errorFetching'),
            variant: 'destructive'
          });
          return;
        }

        if (data) {
          setLead(data);
          setEditedLead(data);
        }
      } catch (error) {
        console.error('Error fetching lead:', error);
        toast({
          title: t('common.error'),
          description: t('leads.errorFetching'),
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLead();
  }, [params.id, t, toast]);

  const handleSave = async () => {
    if (!lead || !editedLead) return;

    try {
      const { error } = await supabase
        .from('leads')
        .update({
          full_name: editedLead.full_name,
          company_name: editedLead.company_name,
          email: editedLead.email,
          job_title: editedLead.job_title,
          phone: editedLead.phone,
          location: editedLead.location,
          status: editedLead.status,
          priority: editedLead.priority,
          notes: editedLead.notes,
          best_contact_time: editedLead.best_contact_time,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) {
        throw error;
      }

      setLead(prev => prev ? { ...prev, ...editedLead } : null);
      setIsEditing(false);
      toast({
        title: t('leads.leadUpdated'),
        description: t('leads.leadUpdatedSuccessfully')
      });
    } catch (error) {
      console.error('Error updating lead:', error);
      toast({
        title: t('common.error'),
        description: t('leads.errorUpdating'),
        variant: 'destructive'
      });
    }
  };

  const handleCancel = () => {
    setEditedLead(lead || {});
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
      case 'to_contact': return 'bg-gray-500';
      case 'contacted': return 'bg-blue-500';
      case 'in_conversation': return 'bg-yellow-500';
      case 'closed': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-red-500';
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

  if (!lead) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            <ClientOnly fallback="Lead not found">
              {t('leads.leadNotFound')}
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
                      value={editedLead.full_name || ''}
                      onChange={(e) => setEditedLead(prev => ({ ...prev, full_name: e.target.value }))}
                      className="text-2xl font-medium border-none p-0 h-auto bg-transparent"
                    />
                  ) : (
                    lead.full_name
                  )}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Building className="w-3 h-3" />
                  {isEditing ? (
                    <Input
                      value={editedLead.company_name || ''}
                      onChange={(e) => setEditedLead(prev => ({ ...prev, company_name: e.target.value }))}
                      className="text-sm border-none p-0 h-auto bg-transparent w-48"
                    />
                  ) : (
                    lead.company_name
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
                  aria-label="Edit lead"
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
            {/* Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <ClientOnly fallback="Notes">
                  {t('leads.notes')}
                </ClientOnly>
              </h2>
              {isEditing ? (
                <Textarea
                  value={editedLead.notes || ''}
                  onChange={(e) => setEditedLead(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this lead..."
                  className="min-h-[120px] border-none bg-transparent p-0 resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {lead.notes || t('leads.noNotes')}
                </p>
              )}
            </Card>

            {/* Suggested Services */}
            {lead.suggested_services && lead.suggested_services.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <ClientOnly fallback="Suggested Services">
                    {t('leads.suggestedServices')}
                  </ClientOnly>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lead.suggested_services.map((service, index) => (
                    <Badge key={index} variant="outline">
                      {service}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Tags */}
            {lead.tags && lead.tags.length > 0 && (
              <Card className="p-6">
                <h2 className="text-lg font-medium text-foreground mb-4">
                  <ClientOnly fallback="Tags">
                    {t('leads.tags')}
                  </ClientOnly>
                </h2>
                <div className="flex flex-wrap gap-2">
                  {lead.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Status">
                  {t('leads.status')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                {isEditing ? (
                  <Select
                    value={editedLead.status || lead.status || 'to_contact'}
                    onValueChange={(value) => setEditedLead(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to_contact">
                        <ClientOnly fallback="To Contact">
                          {t('leads.toContact')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="contacted">
                        <ClientOnly fallback="Contacted">
                          {t('leads.contacted')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="in_conversation">
                        <ClientOnly fallback="In Conversation">
                          {t('leads.inConversation')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="closed">
                        <ClientOnly fallback="Closed">
                          {t('leads.closed')}
                        </ClientOnly>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status || 'to_contact')}`}></div>
                    <Badge variant="outline">
                      <ClientOnly fallback={lead.status || 'to_contact'}>
                        {t(`leads.${lead.status || 'to_contact'}`)}
                      </ClientOnly>
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority || 'medium')}`}></div>
                  <span className="text-sm text-muted-foreground">
                    <ClientOnly fallback={lead.priority || 'medium'}>
                      {t(`leads.priority.${lead.priority || 'medium'}`)}
                    </ClientOnly>
                  </span>
                </div>
              </div>
            </Card>

            {/* Lead Details */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Lead Details">
                  {t('leads.leadDetails')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                {lead.job_title && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Job Title">
                          {t('leads.jobTitle')}
                        </ClientOnly>
                      </p>
                      {isEditing ? (
                        <Input
                          value={editedLead.job_title || ''}
                          onChange={(e) => setEditedLead(prev => ({ ...prev, job_title: e.target.value }))}
                          className="text-sm border-none p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <p className="text-foreground">{lead.job_title}</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Email">
                        {t('leads.email')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedLead.email || ''}
                        onChange={(e) => setEditedLead(prev => ({ ...prev, email: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <a href={`mailto:${lead.email}`} className="text-foreground hover:underline">
                        {lead.email}
                      </a>
                    )}
                  </div>
                </div>

                {lead.phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Phone">
                          {t('leads.phone')}
                        </ClientOnly>
                      </p>
                      {isEditing ? (
                        <Input
                          value={editedLead.phone || ''}
                          onChange={(e) => setEditedLead(prev => ({ ...prev, phone: e.target.value }))}
                          className="text-sm border-none p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <a href={`tel:${lead.phone}`} className="text-foreground hover:underline">
                          {lead.phone}
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {lead.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Location">
                          {t('leads.location')}
                        </ClientOnly>
                      </p>
                      {isEditing ? (
                        <Input
                          value={editedLead.location || ''}
                          onChange={(e) => setEditedLead(prev => ({ ...prev, location: e.target.value }))}
                          className="text-sm border-none p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <p className="text-foreground">{lead.location}</p>
                      )}
                    </div>
                  </div>
                )}

                {lead.best_contact_time && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Best Contact Time">
                          {t('leads.bestContactTime')}
                        </ClientOnly>
                      </p>
                      {isEditing ? (
                        <Input
                          value={editedLead.best_contact_time || ''}
                          onChange={(e) => setEditedLead(prev => ({ ...prev, best_contact_time: e.target.value }))}
                          className="text-sm border-none p-0 h-auto bg-transparent"
                        />
                      ) : (
                        <p className="text-foreground">{lead.best_contact_time}</p>
                      )}
                    </div>
                  </div>
                )}

                {lead.website && (
                  <div className="flex items-center gap-3">
                    <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Website">
                          {t('leads.website')}
                        </ClientOnly>
                      </p>
                      <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                        {lead.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Activity">
                  {t('leads.activity')}
                </ClientOnly>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Created">
                        {t('leads.created')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
                {lead.updated_at && (
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Updated">
                          {t('leads.updated')}
                        </ClientOnly>
                      </p>
                      <p className="text-foreground">{formatDate(lead.updated_at)}</p>
                    </div>
                  </div>
                )}
                {lead.last_contact_date && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Last Contact">
                          {t('leads.lastContact')}
                        </ClientOnly>
                      </p>
                      <p className="text-foreground">{formatDate(lead.last_contact_date)}</p>
                    </div>
                  </div>
                )}
                {lead.next_follow_up && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Next Follow Up">
                          {t('leads.nextFollowUp')}
                        </ClientOnly>
                      </p>
                      <p className="text-foreground">{formatDate(lead.next_follow_up)}</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Quick Actions">
                  {t('leads.quickActions')}
                </ClientOnly>
              </h3>
              <div className="space-y-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement contact action
                  }}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Contact Lead">
                    {t('leads.contactLead')}
                  </ClientOnly>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    // TODO: Implement schedule follow up
                  }}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  <ClientOnly fallback="Schedule Follow Up">
                    {t('leads.scheduleFollowUp')}
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