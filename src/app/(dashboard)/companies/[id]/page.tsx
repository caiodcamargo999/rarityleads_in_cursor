"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ArrowLeft, Building, Users, MapPin, Mail, Phone, Globe, Edit3, Save, X, Calendar, DollarSign, Target, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ClientOnly from '@/components/ClientOnly';

interface Company {
  id: string;
  name: string;
  industry: string;
  size: string;
  revenue: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  description: string;
  status: 'active' | 'prospect' | 'customer' | 'inactive';
  leads_count: number;
  created_at: string;
  updated_at: string;
  tags: string[];
  notes: string;
}

export default function CompanyDetailPage() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const [company, setCompany] = useState<Company | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editedCompany, setEditedCompany] = useState<Partial<Company>>({});

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockCompany: Company = {
      id: params?.id as string || 'unknown',
      name: "TechCorp Solutions",
      industry: "Technology",
      size: "50-200",
      revenue: "$5M-$25M",
      location: "San Francisco, CA",
      website: "https://techcorp.com",
      email: "contact@techcorp.com",
      phone: "+1 (555) 123-4567",
      description: "Leading technology solutions provider specializing in AI and machine learning applications for enterprise clients.",
      status: 'prospect',
      leads_count: 12,
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-20T14:30:00Z",
      tags: ["AI/ML", "Enterprise", "B2B", "SaaS"],
      notes: "High potential client. Interested in our AI-powered lead generation solutions. Follow up scheduled for next week."
    };

    setCompany(mockCompany);
    setEditedCompany(mockCompany);
    setIsLoading(false);
  }, [params?.id]);

  const handleSave = async () => {
    // TODO: Implement actual save logic
    setCompany(prev => prev ? { ...prev, ...editedCompany } : null);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCompany(company || {});
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (!company) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-muted-foreground">
            <ClientOnly fallback="Company not found">
              {t('companies.notFound')}
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
                      value={editedCompany.name || ''}
                      onChange={(e) => setEditedCompany(prev => ({ ...prev, name: e.target.value }))}
                      className="text-2xl font-medium border-none p-0 h-auto bg-transparent"
                    />
                  ) : (
                    company.name
                  )}
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Building className="w-3 h-3" />
                  {isEditing ? (
                    <Input
                      value={editedCompany.industry || ''}
                      onChange={(e) => setEditedCompany(prev => ({ ...prev, industry: e.target.value }))}
                      className="text-sm border-none p-0 h-auto bg-transparent w-32"
                    />
                  ) : (
                    company.industry
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
                  aria-label="Edit company"
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
                  {t('companies.description')}
                </ClientOnly>
              </h2>
              {isEditing ? (
                <Textarea
                  value={editedCompany.description || ''}
                  onChange={(e) => setEditedCompany(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter company description..."
                  className="min-h-[120px] border-none bg-transparent p-0 resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {company.description}
                </p>
              )}
            </Card>

            {/* Notes */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <ClientOnly fallback="Notes">
                  {t('companies.notes')}
                </ClientOnly>
              </h2>
              {isEditing ? (
                <Textarea
                  value={editedCompany.notes || ''}
                  onChange={(e) => setEditedCompany(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add notes about this company..."
                  className="min-h-[120px] border-none bg-transparent p-0 resize-none"
                />
              ) : (
                <p className="text-muted-foreground leading-relaxed">
                  {company.notes}
                </p>
              )}
            </Card>

            {/* Tags */}
            <Card className="p-6">
              <h2 className="text-lg font-medium text-foreground mb-4">
                <ClientOnly fallback="Tags">
                  {t('companies.tags')}
                </ClientOnly>
              </h2>
              <div className="flex flex-wrap gap-2">
                {(editedCompany.tags || company.tags).map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Status">
                  {t('companies.status')}
                </ClientOnly>
              </h3>
              {isEditing ? (
                <Select
                  value={editedCompany.status || company.status}
                  onValueChange={(value) => setEditedCompany(prev => ({ ...prev, status: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <ClientOnly fallback="Active">
                        {t('companies.active')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="prospect">
                      <ClientOnly fallback="Prospect">
                        {t('companies.prospect')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="customer">
                      <ClientOnly fallback="Customer">
                        {t('companies.customer')}
                      </ClientOnly>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <ClientOnly fallback="Inactive">
                        {t('companies.inactive')}
                      </ClientOnly>
                    </SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant={company.status === 'customer' ? 'default' : 'outline'}>
                  <ClientOnly fallback={company.status}>
                    {t(`companies.${company.status}`)}
                  </ClientOnly>
                </Badge>
              )}
            </Card>

            {/* Company Details */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Company Details">
                  {t('companies.details')}
                </ClientOnly>
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Size">
                        {t('companies.size')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.size || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, size: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{company.size}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Revenue">
                        {t('companies.revenue')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.revenue || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, revenue: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{company.revenue}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Location">
                        {t('companies.location')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.location || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, location: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <p className="text-foreground">{company.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Website">
                        {t('companies.website')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.website || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, website: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline">
                        {company.website}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Email">
                        {t('companies.email')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.email || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, email: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <a href={`mailto:${company.email}`} className="text-foreground hover:underline">
                        {company.email}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Phone">
                        {t('companies.phone')}
                      </ClientOnly>
                    </p>
                    {isEditing ? (
                      <Input
                        value={editedCompany.phone || ''}
                        onChange={(e) => setEditedCompany(prev => ({ ...prev, phone: e.target.value }))}
                        className="text-sm border-none p-0 h-auto bg-transparent"
                      />
                    ) : (
                      <a href={`tel:${company.phone}`} className="text-foreground hover:underline">
                        {company.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity */}
            <Card className="p-6">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">
                <ClientOnly fallback="Activity">
                  {t('companies.activity')}
                </ClientOnly>
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Created">
                        {t('companies.created')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(company.created_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Updated">
                        {t('companies.updated')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{formatDate(company.updated_at)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      <ClientOnly fallback="Leads">
                        {t('companies.leads')}
                      </ClientOnly>
                    </p>
                    <p className="text-foreground">{company.leads_count}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 