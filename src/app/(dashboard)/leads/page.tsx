"use client"

import { useEffect, useState, Suspense, useMemo, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import LeadsResultsGrid from "@/components/leads/LeadsResultsGrid"
import LeadInputForm from "@/components/leads/LeadInputForm"
import LeadModal from "@/components/leads/LeadModal"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion";
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { useTranslation } from 'react-i18next'
import { ClientOnly } from '@/components/ClientOnly'
import { User, Building, Mail, Phone, MapPin, Calendar, ExternalLink, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

// Types for lead requests and leads (adjust as needed)
type LeadRequest = {
  id: string
  user_id: string
  persona: string
  filters: any
  created_at: string
}
type Lead = {
  id: string;
  user_id?: string;
  full_name: string;
  company_name: string;
  email: string;
  created_at: string;
  // Optional fields for API-enriched leads
  job_title?: string | undefined;
  location?: string | undefined;
  timezone?: string | undefined;
  contact_channels?: string[];
  source?: string | undefined;
  tags?: string[];
  suggested_services?: string[];
  best_contact_time?: string | undefined;
  status?: string; // Added for inline editing
  ai_score?: number;
  phone?: string;
  website?: string;
  linkedin_url?: string;
  company_size?: string;
  annual_revenue?: string;
  industry?: string;
  priority?: 'low' | 'medium' | 'high';
  notes?: string;
  whatsapp?: string;
  social?: string;
}

// Disable static generation for this page
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function LeadsPage() {
  const { t } = useTranslation()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [leadRequests, setLeadRequests] = useState<LeadRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LeadRequest | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [manualLeads, setManualLeads] = useState<Lead[]>([])
  const [aiGeneratedLeads, setAiGeneratedLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [manualLeadForm, setManualLeadForm] = useState({ full_name: '', company_name: '', email: '', whatsapp: '', website: '', social: '' });
  const [manualLeadLoading, setManualLeadLoading] = useState(false)
  const [search, setSearch] = useState('');
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Handle deep linking - open modal if lead ID is in URL
  useEffect(() => {
    const leadId = searchParams?.get('id')
    if (leadId && (leads.length > 0 || manualLeads.length > 0 || aiGeneratedLeads.length > 0)) {
      const allLeads = [...leads, ...manualLeads, ...aiGeneratedLeads]
      const lead = allLeads.find(l => l.id === leadId)
      if (lead) {
        setSelectedLead(lead)
        setIsModalOpen(true)
      }
    }
  }, [searchParams, leads, manualLeads, aiGeneratedLeads])

  // Filtered manual leads
  const filteredManualLeads = useMemo(() => {
    return manualLeads.filter(lead => {
      const matchesSearch =
        lead.full_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      return matchesSearch;
    });
  }, [manualLeads, search]);

  // Filtered API-enriched lead requests
  const filteredLeadRequests = useMemo(() => {
    return leadRequests.filter(req => {
      const matchesPersona = activePersona ? req.persona === activePersona : true;
      const matchesSearch = req.persona.toLowerCase().includes(search.toLowerCase());
      return matchesPersona && matchesSearch;
    });
  }, [leadRequests, search, activePersona]);

  // Bulk select logic
  const allManualIds = filteredManualLeads.map(l => l.id);
  const allApiIds = leads.map(l => l.id);
  const allAiIds = aiGeneratedLeads.map(l => l.id);
  const allIds = [...allManualIds, ...allApiIds, ...allAiIds];

  const isAllSelected = allIds.length > 0 && selectedLeads.length === allIds.length;
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < allIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const handleBulkDelete = async () => {
    if (selectedLeads.length === 0) return;
    
    if (confirm(t('leads.confirmDelete'))) {
      try {
        // Remove from all lead arrays
        setManualLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
        setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
        setAiGeneratedLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
        
        setSelectedLeads([]);
        toast({ title: t('leads.leadsDeleted'), description: t('leads.leadsDeletedSuccessfully') });
      } catch (error) {
        toast({ title: t('leads.errorDeleting'), description: t('leads.errorDeleting'), variant: 'destructive' });
      }
    }
  };

  const handleBulkMove = async (stage: string) => {
    if (selectedLeads.length === 0) return;
    
    try {
      // Update all lead arrays
      setManualLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      setLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      setAiGeneratedLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      
      setSelectedLeads([]);
      toast({ title: t('leads.leadsMoved'), description: t('leads.leadsMovedSuccessfully') });
    } catch (error) {
      toast({ title: t('leads.errorMoving'), description: t('leads.errorMoving'), variant: 'destructive' });
    }
  };

  const handleBulkExport = (format: 'csv' | 'json') => {
    if (selectedLeads.length === 0) {
      toast({ title: t('leads.noLeadsSelected'), description: t('leads.selectLeadsFirst') });
      return;
    }
    
    const allLeads = [...leads, ...manualLeads, ...aiGeneratedLeads];
    const selectedLeadData = allLeads.filter(l => selectedLeads.includes(l.id));
    
    if (format === 'json') {
      const dataStr = JSON.stringify(selectedLeadData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: t('leads.leadsExported'), description: t('leads.exportJson') });
    } else {
      const csvContent = [
        ['Name', 'Company', 'Email', 'Phone', 'Status', 'AI Score'],
        ...selectedLeadData.map(lead => [
          lead.full_name,
          lead.company_name,
          lead.email,
          lead.phone || '',
          lead.status || '',
          lead.ai_score?.toString() || ''
        ])
      ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `leads-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      toast({ title: t('leads.leadsExported'), description: t('leads.exportCsv') });
    }
    setSelectedLeads([]);
  };

  // Handle lead card click
  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsModalOpen(true)
  };

  // Handle contact button click (prevent card click)
  const handleContactClick = (e: React.MouseEvent, lead: Lead) => {
    e.stopPropagation();
    // TODO: Implement contact action
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedLead(null)
  }

  // Handle lead save
  const handleLeadSave = (updatedLead: Lead) => {
    // Update in all lead arrays
    setManualLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l))
    setLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l))
    setAiGeneratedLeads(prev => prev.map(l => l.id === updatedLead.id ? updatedLead : l))
    setSelectedLead(updatedLead)
  }

  // Handle lead delete
  const handleLeadDelete = (leadId: string) => {
    setManualLeads(prev => prev.filter(l => l.id !== leadId))
    setLeads(prev => prev.filter(l => l.id !== leadId))
    setAiGeneratedLeads(prev => prev.filter(l => l.id !== leadId))
  }

  // Fetch user session and lead requests
  useEffect(() => {
    const fetchUserAndRequests = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        setLoading(false)
        return
      }
      setUserId(session.user.id)
      // Fetch lead requests for this user
      const { data: requests, error } = await supabase
        .from("lead_requests")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
      if (!error && requests) {
        setLeadRequests(requests)
        if (requests.length > 0) setSelectedRequest(requests[0])
      }
      // Fetch manual leads for this user (no lead_request_id)
      const { data: manual, error: manualError } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", session.user.id)
        .is("lead_request_id", null)
        .order("created_at", { ascending: false })
      if (!manualError && manual) {
        setManualLeads(manual)
      }
      setLoading(false)
    }
    fetchUserAndRequests()
  }, [])

  // Fetch leads for the selected request
  useEffect(() => {
    if (!selectedRequest) return
    const fetchLeads = async () => {
      setLoading(true)
      const { data: leadsData, error } = await supabase
        .from("leads")
        .select("*")
        .eq("lead_request_id", selectedRequest.id)
        .order("ai_score", { ascending: false })
      if (!error && leadsData) {
        setLeads(leadsData)
      } else {
        setLeads([])
      }
      setLoading(false)
    }
    fetchLeads()
  }, [selectedRequest])

  // Handle AI lead generation
  const handleAiLeadGeneration = async (leads: Lead[], description: string) => {
    setAiGeneratedLeads(leads)
    toast({
      title: t('leads.aiGeneration.success'),
      description: `${leads.length} leads generated successfully`,
    })
  }

  // Handle manual lead creation
  const handleManualLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !manualLeadForm.full_name || !manualLeadForm.company_name || !manualLeadForm.email) return;
    setManualLeadLoading(true);
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert([{ user_id: userId, full_name: manualLeadForm.full_name, company_name: manualLeadForm.company_name, email: manualLeadForm.email, whatsapp: manualLeadForm.whatsapp, website: manualLeadForm.website, social: manualLeadForm.social }])
      .select()
      .single();
    if (!error && inserted) {
      setManualLeads(prev => [inserted, ...prev]);
      setManualLeadForm({ full_name: '', company_name: '', email: '', whatsapp: '', website: '', social: '' });
    }
    setManualLeadLoading(false);
  }

  const stageCounts = ['to_contact', 'contacted', 'in_conversation', 'closed'].map(stage =>
    [...manualLeads, ...leads, ...aiGeneratedLeads].filter(l => l.status === stage).length
  );
  const conversionRate = stageCounts[3] / (stageCounts[0] + stageCounts[1] + stageCounts[2] + stageCounts[3] || 1);
  const chartData = {
    labels: [t('leads.toContact'), t('leads.contacted'), t('leads.inConversation'), t('leads.closed')],
    datasets: [
      {
        label: 'Leads per Stage',
        data: stageCounts,
        backgroundColor: ['#8B5CF6', '#6366F1', '#818CF8', '#22D3EE'],
        borderRadius: 8,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: { x: { grid: { display: false } }, y: { grid: { color: '#232336' }, beginAtZero: true } },
  };

  return (
    <div className="min-h-screen bg-background w-full overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl lg:text-2xl font-medium text-foreground mb-6 px-4 pt-4"
      >
        <ClientOnly fallback="Leads">
          {t('leads.title')}
        </ClientOnly>
      </motion.h1>
      
      {/* Analytics summary */}
      <motion.div className="w-full max-w-7xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center px-4">
        <div className="text-lg text-foreground font-medium">
          <ClientOnly fallback="Total Leads">
            {t('leads.totalLeads')}
          </ClientOnly>
          : {manualLeads.length + leads.length + aiGeneratedLeads.length}
        </div>
        <div className="text-sm text-muted-foreground">
          <ClientOnly fallback="Selected">
            {t('leads.selected')}
          </ClientOnly>
          : {selectedLeads.length}
        </div>
        <div className="flex-1 min-w-[220px] max-w-md">
          <Bar data={chartData} options={chartOptions} height={80} />
        </div>
        <div className="text-sm text-muted-foreground">
          <ClientOnly fallback="Conversion Rate">
            {t('leads.conversionRate')}
          </ClientOnly>
          : {(conversionRate * 100).toFixed(1)}%
        </div>
      </motion.div>
      
      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card border border-border rounded-xl shadow-sm px-6 py-3 flex gap-4 items-center"
          >
            <Button variant="danger" onClick={handleBulkDelete} aria-label={t('leads.deleteSelected')}>
              <ClientOnly fallback="Delete">
                {t('leads.delete')}
              </ClientOnly>
            </Button>
            <Button variant="outline" onClick={() => handleBulkMove('contacted')} aria-label={t('leads.moveToContact')}>
              <ClientOnly fallback="Move to Contacted">
                {t('leads.moveToContact')}
              </ClientOnly>
            </Button>
            <Button variant="outline" onClick={() => handleBulkExport('csv')} aria-label={t('leads.exportSelectedCsv')}>
              <ClientOnly fallback="Export CSV">
                {t('leads.exportSelectedCsv')}
              </ClientOnly>
            </Button>
            <Button variant="outline" onClick={() => handleBulkExport('json')} aria-label={t('leads.exportSelectedJson')}>
              <ClientOnly fallback="Export JSON">
                {t('leads.exportSelectedJson')}
              </ClientOnly>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Lead Generation Form */}
      <LeadInputForm onLeadsGenerated={handleAiLeadGeneration} />

      {/* AI Generated Leads */}
      {aiGeneratedLeads.length > 0 && (
        <LeadsResultsGrid leads={aiGeneratedLeads} />
      )}

      {/* Manual Lead Creation Form */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-8">
        <Card className="bg-card border border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium text-foreground">
              <ClientOnly fallback="Create Lead Manually">
                {t('leads.createLeadManually')}
              </ClientOnly>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleManualLeadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="Full Name">
                      {t('leads.fullName')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="text"
                    value={manualLeadForm.full_name}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, full_name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="Company Name">
                      {t('leads.companyName')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="text"
                    value={manualLeadForm.company_name}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, company_name: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="Email">
                      {t('leads.email')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="email"
                    value={manualLeadForm.email}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, email: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="WhatsApp">
                      {t('leads.whatsapp')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="text"
                    value={manualLeadForm.whatsapp}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, whatsapp: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="Website">
                      {t('leads.website')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="url"
                    value={manualLeadForm.website}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, website: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    <ClientOnly fallback="Social Media">
                      {t('leads.social')}
                    </ClientOnly>
                  </label>
                  <Input
                    type="text"
                    value={manualLeadForm.social}
                    onChange={(e) => setManualLeadForm({ ...manualLeadForm, social: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={manualLeadLoading}
                className="w-full md:w-auto"
              >
                {manualLeadLoading ? (
                  <ClientOnly fallback="Creating...">
                    {t('leads.creating')}
                  </ClientOnly>
                ) : (
                  <ClientOnly fallback="Create Lead">
                    {t('leads.createLead')}
                  </ClientOnly>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Previous Lead Searches */}
      {leadRequests.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 mb-8">
          <Card className="bg-card border border-border">
            <CardHeader>
              <CardTitle className="text-lg font-medium text-foreground">
                <ClientOnly fallback="Previous Lead Searches">
                  {t('leads.previousLeadSearches')}
                </ClientOnly>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-muted-foreground text-center py-8">
                  <ClientOnly fallback="Loading...">
                    {t('leads.loading')}
                  </ClientOnly>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredLeadRequests.map((request) => (
                    <div
                      key={request.id}
                      className={`p-4 border border-border rounded-lg cursor-pointer transition-colors ${
                        selectedRequest?.id === request.id
                          ? 'bg-primary/10 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedRequest(request)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{request.persona}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(request.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="outline" size="sm">
                          <ClientOnly fallback="View">
                            {t('leads.view')}
                          </ClientOnly>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results */}
      {leads.length > 0 && (
        <div className="w-full max-w-7xl mx-auto px-4 mb-8">
          <Card className="bg-card border border-border">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-medium text-foreground">
                  <ClientOnly fallback="Results">
                    {t('leads.results')}
                  </ClientOnly>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={toggleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm text-muted-foreground">
                    <ClientOnly fallback="Select All">
                      {t('leads.selectAll')}
                    </ClientOnly>
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-muted-foreground text-center py-8">
                  <ClientOnly fallback="Loading leads...">
                    {t('leads.loadingLeads')}
                  </ClientOnly>
                </div>
              ) : (
                <div className="space-y-3">
                  {leads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group"
                      onClick={() => handleLeadClick(lead)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedLeads.includes(lead.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              toggleSelect(lead.id);
                            }}
                            className="rounded border-border"
                          />
                          <div>
                            <p className="font-medium text-foreground group-hover:text-rarity-500 transition-colors">
                              {lead.full_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{lead.company_name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              {lead.ai_score && (
                                <Badge variant="outline" className="text-xs">
                                  AI: {lead.ai_score}
                                </Badge>
                              )}
                              {lead.status && (
                                <Badge variant="secondary" className="text-xs">
                                  {t(`leads.${lead.status}`)}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {lead.email && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleContactClick(e, lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Mail className="w-4 h-4" />
                            </Button>
                          )}
                          {lead.phone && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={(e) => handleContactClick(e, lead)}
                              className="h-8 w-8 p-0"
                            >
                              <Phone className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleContactClick(e, lead)}
                            className="h-8 w-8 p-0"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Manually Created Leads */}
      <div className="w-full max-w-7xl mx-auto px-4 mb-8">
        <Card className="bg-card border border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-medium text-foreground">
                <ClientOnly fallback="Manually Created Leads">
                  {t('leads.manuallyCreatedLeads')}
                </ClientOnly>
              </CardTitle>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={toggleSelectAll}
                  className="rounded border-border"
                />
                <span className="text-sm text-muted-foreground">
                  <ClientOnly fallback="Select All">
                    {t('leads.selectAll')}
                  </ClientOnly>
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredManualLeads.length === 0 ? (
              <div className="text-muted-foreground text-center py-8">
                <ClientOnly fallback="No manually created leads yet.">
                  {t('leads.noManualLeads')}
                </ClientOnly>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredManualLeads.map((lead) => (
                  <motion.div
                    key={lead.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 border border-border rounded-lg hover:shadow-sm transition-all duration-200 cursor-pointer group"
                    onClick={() => handleLeadClick(lead)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(lead.id);
                          }}
                          className="rounded border-border"
                        />
                        <div>
                          <p className="font-medium text-foreground group-hover:text-rarity-500 transition-colors">
                            {lead.full_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{lead.company_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {lead.status && (
                              <Badge variant="secondary" className="text-xs">
                                {t(`leads.${lead.status}`)}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lead.email && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleContactClick(e, lead)}
                            className="h-8 w-8 p-0"
                          >
                            <Mail className="w-4 h-4" />
                          </Button>
                        )}
                        {lead.phone && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => handleContactClick(e, lead)}
                            className="h-8 w-8 p-0"
                          >
                            <Phone className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => handleContactClick(e, lead)}
                          className="h-8 w-8 p-0"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lead Modal */}
      <LeadModal
        lead={selectedLead}
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSave={handleLeadSave}
        onDelete={handleLeadDelete}
      />
    </div>
  )
} 