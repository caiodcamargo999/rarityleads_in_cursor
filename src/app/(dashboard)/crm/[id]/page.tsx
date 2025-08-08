"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Building, Mail, Phone, MapPin, Calendar, Edit3, Save, X, MessageSquare, Target, Activity, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientOnly from '@/components/ClientOnly';

interface Lead {
  id: string;
  full_name: string;
  company_name: string;
  job_title: string;
  email: string;
  phone?: string;
  location: string;
  source: string;
  status: 'to_contact' | 'contacted' | 'in_conversation' | 'closed';
  priority: 'low' | 'medium' | 'high';
  tags: string[];
  notes: string;
  best_contact_time: string;
  suggested_services: string[];
  created_at: string;
  updated_at: string;
  last_contact_date?: string;
  next_follow_up?: string;
}

export default function LeadDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedLead, setEditedLead] = useState<Partial<Lead>>({});

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockLead: Lead = {
      id: params?.id as string || 'unknown',
      full_name: "John Smith",
      company_name: "TechCorp Solutions",
      job_title: "Head of Marketing",
      email: "john.smith@techcorp.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      source: "LinkedIn",
      status: 'contacted',
      priority: 'high',
      tags: ["B2B", "Marketing", "Tech", "Decision Maker"],
      notes: "Interested in our AI-powered lead generation solutions. Had initial call on Jan 15th. Follow up scheduled for next week to discuss pricing and implementation timeline.",
      best_contact_time: "Tuesday 2-4 PM PST",
      suggested_services: ["Lead Generation", "Marketing Automation", "CRM Integration"],
      created_at: "2024-01-10T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      last_contact_date: "2024-01-15T10:00:00Z",
      next_follow_up: "2024-01-25T14:00:00Z"
    };

    setLead(mockLead);
    setEditedLead(mockLead);
    setIsLoading(false);
  }, [params?.id]);

  const handleSave = async () => {
    // TODO: Implement actual save logic
    setLead(prev => prev ? { ...prev, ...editedLead } : null);
    setIsEditing(false);
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
              {t('crm.leadNotFound')}
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
                  {t('crm.notes')}
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
                  {lead.notes}
                </p>
              )}
            </Card>

            {/* Suggested Services */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Target className="w-4 h-4" />
                <ClientOnly fallback="Suggested Services">
                  {t('crm.suggestedServices')}
                </ClientOnly>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(editedLead.suggested_services || lead.suggested_services).map((service, index) => (
                  <Badge key={index} variant="outline">
                    {service}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                <ClientOnly fallback="Tags">
                  {t('crm.tags')}
                </ClientOnly>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(editedLead.tags || lead.tags).map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status & Priority */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Status">
                  {t('crm.status')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                {isEditing ? (
                  <Select
                    value={editedLead.status || lead.status}
                    onValueChange={(value) => setEditedLead(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="to_contact">
                        <ClientOnly fallback="To Contact">
                          {t('crm.toContact')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="contacted">
                        <ClientOnly fallback="Contacted">
                          {t('crm.contacted')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="in_conversation">
                        <ClientOnly fallback="In Conversation">
                          {t('crm.inConversation')}
                        </ClientOnly>
                      </SelectItem>
                      <SelectItem value="closed">
                        <ClientOnly fallback="Closed">
                          {t('crm.closed')}
                        </ClientOnly>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(lead.status)}`}></div>
                    <Badge variant="outline">
                      <ClientOnly fallback={lead.status}>
                        {t(`crm.${lead.status}`)}
                      </ClientOnly>
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(lead.priority)}`}></div>
                  <span className="text-sm text-muted-foreground">
                    <ClientOnly fallback={lead.priority}>
                      {t(`crm.priority.${lead.priority}`)}
                    </ClientOnly>
                  </span>
                </div>
              </div>
            </Card>

            {/* Lead Details */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Lead Details">
                  {t('crm.leadDetails')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Job Title">
                        {t('crm.jobTitle')}
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

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Email">
                        {t('crm.email')}
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
                          {t('crm.phone')}
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

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Location">
                        {t('crm.location')}
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

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Best Contact Time">
                        {t('crm.bestContactTime')}
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
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Activity">
                  {t('crm.activity')}
                </ClientOnly>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Created">
                        {t('crm.created')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(lead.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Updated">
                        {t('crm.updated')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(lead.updated_at)}</p>
                  </div>
                </div>
                {lead.last_contact_date && (
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        <ClientOnly fallback="Last Contact">
                          {t('crm.lastContact')}
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
                          {t('crm.nextFollowUp')}
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
                  {t('crm.quickActions')}
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
                    {t('crm.contactLead')}
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
                    {t('crm.scheduleFollowUp')}
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