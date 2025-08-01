"use client"

import { useEffect, useState, Suspense, useMemo, useRef } from "react"
import { supabase } from "@/lib/supabase"
import LeadsResultsGrid from "@/components/leads/LeadsResultsGrid"
import LeadInputForm from "@/components/leads/LeadInputForm"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AnimatePresence } from "framer-motion";
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
import { useTranslation } from 'react-i18next'
import { ClientOnly } from '@/components/ClientOnly'
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
}

// Disable static generation for this page
export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export default function LeadsPage() {
  const { t } = useTranslation()
  const [leadRequests, setLeadRequests] = useState<LeadRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<LeadRequest | null>(null)
  const [leads, setLeads] = useState<Lead[]>([])
  const [manualLeads, setManualLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [manualLeadForm, setManualLeadForm] = useState({ full_name: '', company_name: '', email: '', whatsapp: '', website: '', social: '' });
  const [manualLeadLoading, setManualLeadLoading] = useState(false)
  const [search, setSearch] = useState('');
  const [activePersona, setActivePersona] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editing, setEditing] = useState(false);

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
  const allIds = [...allManualIds, ...allApiIds];
  const isAllSelected = selectedLeads.length === allIds.length && allIds.length > 0;
  const isIndeterminate = selectedLeads.length > 0 && selectedLeads.length < allIds.length;

  const toggleSelectAll = () => {
    if (isAllSelected) setSelectedLeads([]);
    else setSelectedLeads(allIds);
  };
  const toggleSelect = (id: string) => {
    setSelectedLeads(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  };

  // Bulk actions
  const handleBulkDelete = async () => {
    if (!window.confirm(t('leads.confirmDelete'))) return;
    try {
      await supabase.from('leads').delete().in('id', selectedLeads);
      setManualLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      toast({ title: t('leads.leadsDeleted'), description: `${selectedLeads.length} ${t('leads.leadsDeleted').toLowerCase()}.` });
    } catch {
      toast({ title: t('common.error'), description: t('leads.errorDeleting'), variant: 'destructive' });
    }
    setSelectedLeads([]);
  };
  const handleBulkMove = async (stage: string) => {
    try {
      await supabase.from('leads').update({ status: stage }).in('id', selectedLeads);
      setManualLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      setLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      toast({ title: t('leads.leadsMoved'), description: `${selectedLeads.length} ${t('leads.leadsMoved').toLowerCase()}.` });
    } catch {
      toast({ title: t('common.error'), description: t('leads.errorMoving'), variant: 'destructive' });
    }
    setSelectedLeads([]);
  };
  const handleBulkExport = (format: 'csv' | 'json') => {
    const allLeads = [...manualLeads, ...leads].filter(l => selectedLeads.includes(l.id));
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(allLeads, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.json';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: t('leads.leadsExported'), description: t('leads.exportJson') });
    } else {
      // CSV export
      const headers = ['id', 'full_name', 'company_name', 'email', 'created_at', 'status'] as const;
      const csv = [headers.join(',')].concat(
        allLeads.map(l => headers.map(h => JSON.stringify((l as Record<string, any>)[h] ?? '')).join(','))
      ).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'leads.csv';
      a.click();
      URL.revokeObjectURL(url);
      toast({ title: t('leads.leadsExported'), description: t('leads.exportCsv') });
    }
    setSelectedLeads([]);
  };

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

  // Handle new lead request submission
  const handleNewLeadRequest = async (persona: string, filters: any) => {
    if (!userId) return
    setLoading(true)
    // Insert new lead request
    const { data: newRequest, error } = await supabase
      .from("lead_requests")
      .insert([{ user_id: userId, persona, filters }])
      .select()
      .single()
    if (!error && newRequest) {
      setLeadRequests(prev => [newRequest, ...prev])
      setSelectedRequest(newRequest)
      // Optionally: trigger Edge Function for enrichment here
      // await fetch("/api/whatsapp/generate-leads", { method: "POST", body: JSON.stringify({ requestId: newRequest.id }) })
    }
    setLoading(false)
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
    [...manualLeads, ...leads].filter(l => l.status === stage).length
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
          : {manualLeads.length + leads.length}
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
            <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label={t('leads.exportSelectedCsv')}>
              <ClientOnly fallback="Export CSV">
                {t('leads.exportCsv')}
              </ClientOnly>
            </Button>
            <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label={t('leads.exportSelectedJson')}>
              <ClientOnly fallback="Export JSON">
                {t('leads.exportJson')}
              </ClientOnly>
            </Button>
            <Button variant="primary" onClick={() => handleBulkMove('to_contact')} aria-label={t('leads.moveToContact')}>
              <ClientOnly fallback="Move to To Contact">
                {t('leads.moveToContact')}
              </ClientOnly>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Advanced Filtering/Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4 mb-6 px-4"
      >
        <input
          type="text"
          placeholder={t('leads.searchPlaceholder')}
          aria-label={t('leads.searchPlaceholder')}
          className="flex-1 bg-background text-foreground rounded px-4 py-2 text-sm border border-border focus:outline-none focus:ring-2 focus:ring-primary transition"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activePersona === null ? 'bg-purple-600 text-white border-purple-600' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'}`}
            aria-label={t('leads.allPersonas')}
            onClick={() => setActivePersona(null)}
          >
            <ClientOnly fallback="All Personas">
              {t('leads.allPersonas')}
            </ClientOnly>
          </button>
          {Array.from(new Set(leadRequests.map(req => req.persona))).map(persona => (
            <button
              key={persona}
              className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activePersona === persona ? 'bg-purple-600 text-white border-purple-600' : 'bg-neutral-800 text-neutral-400 border-neutral-700 hover:bg-neutral-700'}`}
              aria-label={`Filter by persona: ${persona}`}
              onClick={() => setActivePersona(persona)}
            >
              {persona}
            </button>
          ))}
        </div>
      </motion.div>
      
      {/* API-enriched lead creation */}
      <div className="w-full max-w-7xl mx-auto mb-6 px-4">
        <LeadInputForm />
      </div>
      
      {/* Manual lead creation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto mb-6 px-4 bg-neutral-900 rounded-xl border border-neutral-800 p-4 lg:p-6"
      >
        <div className="font-medium text-white mb-4">
          <ClientOnly fallback="Create Lead Manually">
            {t('leads.createLeadManually')}
          </ClientOnly>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4" onSubmit={handleManualLeadSubmit}>
          <input
            type="text"
            placeholder={t('leads.fullName')}
            aria-label={t('leads.fullName')}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            value={manualLeadForm.full_name}
            onChange={e => setManualLeadForm(f => ({ ...f, full_name: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder={t('leads.companyName')}
            aria-label={t('leads.companyName')}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            value={manualLeadForm.company_name}
            onChange={e => setManualLeadForm(f => ({ ...f, company_name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder={t('leads.email')}
            aria-label={t('leads.email')}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            value={manualLeadForm.email}
            onChange={e => setManualLeadForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder={t('leads.whatsappNumber')}
            aria-label={t('leads.whatsappNumber')}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            value={manualLeadForm.whatsapp || ''}
            onChange={e => setManualLeadForm(f => ({ ...f, whatsapp: e.target.value }))}
          />
          <input
            type="text"
            placeholder={t('leads.companyWebsite')}
            aria-label={t('leads.companyWebsite')}
            className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition"
            value={manualLeadForm.website || ''}
            onChange={e => setManualLeadForm(f => ({ ...f, website: e.target.value }))}
          />
          <Button
            type="submit"
            variant="primary"
            aria-label={t('leads.createLead')}
            disabled={manualLeadLoading}
            className="w-full"
          >
            {manualLeadLoading ? t('leads.creating') : t('leads.createLead')}
          </Button>
        </form>
      </motion.div>
      
      {/* Main content grid */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Previous Lead Searches (API-enriched) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 bg-neutral-900 rounded-xl border border-neutral-800 p-4 min-h-[400px]"
          >
            <div className="font-medium text-white mb-4">
              <ClientOnly fallback="Previous Lead Searches">
                {t('leads.previousLeadSearches')}
              </ClientOnly>
            </div>
            {loading ? (
              <div className="text-neutral-400">{t('leads.loading')}</div>
            ) : filteredLeadRequests.length === 0 ? (
              <div className="text-neutral-400">
                <ClientOnly fallback="No previous lead searches yet.">
                  {t('leads.noPreviousSearches')}
                </ClientOnly>
              </div>
            ) : (
              <ul className="space-y-2">
                {filteredLeadRequests.map(req => (
                  <li key={req.id}>
                    <Button
                      variant={selectedRequest?.id === req.id ? "primary" : "secondary"}
                      aria-label={`View lead search from ${new Date(req.created_at).toLocaleString()}`}
                      className="w-full text-left"
                      onClick={() => setSelectedRequest(req)}
                    >
                      <span className="truncate">{req.persona}</span>
                      <span className="ml-2 text-xs text-neutral-400">{new Date(req.created_at).toLocaleDateString()}</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
          
          {/* Results (API-enriched) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800 p-4 min-h-[400px]"
          >
            <div className="font-medium text-white mb-4">
              <ClientOnly fallback="Results">
                {t('leads.results')}
              </ClientOnly>
            </div>
            <Suspense fallback={<div className="text-neutral-400">{t('leads.loadingLeads')}</div>}>
              <LeadsResultsGrid leads={leads} />
            </Suspense>
          </motion.div>
        </div>
      </div>
      
      {/* Manual Leads List with checkboxes and details modal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-7xl mx-auto mt-8 px-4 bg-neutral-900 rounded-xl border border-neutral-800 p-6"
      >
        <div className="flex items-center mb-4">
          <input 
            type="checkbox" 
            checked={isAllSelected} 
            ref={el => { if (el) el.indeterminate = isIndeterminate; }} 
            onChange={toggleSelectAll} 
            aria-label={t('leads.selectAll')} 
            className="mr-3" 
          />
          <div className="font-medium text-white">
            <ClientOnly fallback="Manually Created Leads">
              {t('leads.manuallyCreatedLeads')}
            </ClientOnly>
          </div>
        </div>
        {filteredManualLeads.length === 0 ? (
          <div className="text-neutral-400">
            <ClientOnly fallback="No manually created leads yet.">
              {t('leads.noManualLeads')}
            </ClientOnly>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredManualLeads.map(lead => (
              <div 
                key={lead.id} 
                className={`bg-neutral-800 rounded-lg p-4 border transition-all ${
                  selectedLeads.includes(lead.id) ? 'border-purple-600 ring-2 ring-purple-600/20' : 'border-neutral-700 hover:border-neutral-600'
                }`}
              > 
                <div className="flex items-start gap-3">
                  <input 
                    type="checkbox" 
                    checked={selectedLeads.includes(lead.id)} 
                    onChange={() => toggleSelect(lead.id)} 
                    aria-label={`Select lead ${lead.full_name}`} 
                    className="mt-1"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => setDetailsLead(lead)}>
                    <div className="font-medium text-white mb-1">{lead.full_name}</div>
                    <div className="text-sm text-neutral-400 mb-1">{lead.company_name}</div>
                    <div className="text-sm text-neutral-400 mb-2">{lead.email}</div>
                    <div className="text-xs text-neutral-500">
                      <ClientOnly fallback="Created">
                        {t('leads.created')}
                      </ClientOnly>
                      {' '}{new Date(lead.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
      
      {/* Lead Details Modal */}
      <AnimatePresence>
        {detailsLead && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
            onClick={() => setDetailsLead(null)}
          >
            <motion.div
              ref={detailsModalRef}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-neutral-900 rounded-xl border border-neutral-800 p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              <button className="absolute top-4 right-4 text-neutral-400 hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsLead(null)}>&times;</button>
              <div className="text-lg font-medium text-white mb-4">
                <ClientOnly fallback="Lead Details">
                  {t('leads.leadDetails')}
                </ClientOnly>
              </div>
              <form onSubmit={async e => {
                e.preventDefault();
                if (!editLead) return;
                setEditing(true);
                try {
                  await supabase.from('leads').update({
                    full_name: editLead.full_name,
                    company_name: editLead.company_name,
                    email: editLead.email,
                    status: editLead.status
                  }).eq('id', editLead.id);
                  setManualLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...editLead } : l));
                  setLeads(prev => prev.map(l => l.id === editLead.id ? { ...l, ...editLead } : l));
                  toast({ title: t('leads.leadUpdated'), description: t('leads.leadUpdated') });
                  setDetailsLead(editLead);
                } catch {
                  toast({ title: t('common.error'), description: t('leads.errorUpdating'), variant: 'destructive' });
                }
                setEditing(false);
              }} className="flex flex-col gap-3">
                <label className="text-xs text-neutral-400">{t('leads.fullName')}</label>
                <input type="text" className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" value={editLead?.full_name ?? ''} onChange={e => setEditLead(l => l ? { ...l, full_name: e.target.value } : l)} />
                <label className="text-xs text-neutral-400">{t('leads.companyName')}</label>
                <input type="text" className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" value={editLead?.company_name ?? ''} onChange={e => setEditLead(l => l ? { ...l, company_name: e.target.value } : l)} />
                <label className="text-xs text-neutral-400">{t('leads.email')}</label>
                <input type="text" className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" value={editLead?.email ?? ''} onChange={e => setEditLead(l => l ? { ...l, email: e.target.value } : l)} />
                <label className="text-xs text-neutral-400">{t('leads.status')}</label>
                <select className="bg-neutral-800 text-white rounded px-3 py-2 text-sm border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-purple-600 transition" value={editLead?.status ?? ''} onChange={e => setEditLead(l => l ? { ...l, status: e.target.value } : l)}>
                  <option value="to_contact">{t('leads.toContact')}</option>
                  <option value="contacted">{t('leads.contacted')}</option>
                  <option value="in_conversation">{t('leads.inConversation')}</option>
                  <option value="closed">{t('leads.closed')}</option>
                </select>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <Button type="submit" variant="primary" loading={editing} aria-label={t('leads.save')}>
                    <ClientOnly fallback="Save">
                      {t('leads.save')}
                    </ClientOnly>
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => setEditLead(detailsLead)} aria-label={t('leads.cancel')}>
                    <ClientOnly fallback="Cancel">
                      {t('leads.cancel')}
                    </ClientOnly>
                  </Button>
                  <Button type="button" variant="danger" onClick={async () => { 
                    if (window.confirm(t('leads.confirmDeleteSingle'))) { 
                      await supabase.from('leads').delete().eq('id', detailsLead.id); 
                      setManualLeads(prev => prev.filter(l => l.id !== detailsLead.id)); 
                      setLeads(prev => prev.filter(l => l.id !== detailsLead.id)); 
                      setDetailsLead(null); 
                      toast({ title: t('leads.leadDeleted'), description: t('leads.leadDeleted') }); 
                    }
                  }} aria-label={t('leads.delete')}>
                    <ClientOnly fallback="Delete">
                      {t('leads.delete')}
                    </ClientOnly>
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label={t('leads.exportJson')}>
                    <ClientOnly fallback="Export JSON">
                      {t('leads.exportJson')}
                    </ClientOnly>
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label={t('leads.exportCsv')}>
                    <ClientOnly fallback="Export CSV">
                      {t('leads.exportCsv')}
                    </ClientOnly>
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 