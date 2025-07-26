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

export default function LeadsPage() {
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
    if (!window.confirm('Are you sure you want to delete the selected leads?')) return;
    try {
      await supabase.from('leads').delete().in('id', selectedLeads);
      setManualLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      toast({ title: 'Leads deleted', description: `${selectedLeads.length} leads deleted.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete leads', variant: 'destructive' });
    }
    setSelectedLeads([]);
  };
  const handleBulkMove = async (stage: string) => {
    try {
      await supabase.from('leads').update({ status: stage }).in('id', selectedLeads);
      setManualLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      setLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      toast({ title: 'Leads moved', description: `${selectedLeads.length} leads moved to ${stage}.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to move leads', variant: 'destructive' });
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
      toast({ title: 'Exported', description: 'Leads exported as JSON.' });
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
      toast({ title: 'Exported', description: 'Leads exported as CSV.' });
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
    labels: ['To Contact', 'Contacted', 'In Conversation', 'Closed'],
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
    <div className="min-h-screen bg-main-bg w-full overflow-x-hidden">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl lg:text-2xl font-medium text-primary-text mb-6 px-4 pt-4"
      >
        Leads
      </motion.h1>
      {/* Analytics summary (placeholder) */}
      <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center px-4">
        <div className="text-lg text-primary-text font-medium">Total Leads: {manualLeads.length + leads.length}</div>
        <div className="text-sm text-secondary-text">Selected: {selectedLeads.length}</div>
        <div className="flex-1 min-w-[220px]">
          <Bar data={chartData} options={chartOptions} height={80} />
        </div>
        <div className="text-sm text-secondary-text">Conversion Rate: {(conversionRate * 100).toFixed(1)}%</div>
      </motion.div>
      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedLeads.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-card-bg border border-dark-border rounded-xl shadow-lg px-6 py-3 flex gap-4 items-center"
          >
            <Button variant="danger" onClick={handleBulkDelete} aria-label="Delete selected leads">Delete</Button>
            <Button variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export selected leads as CSV">Export CSV</Button>
            <Button variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export selected leads as JSON">Export JSON</Button>
            <Button variant="primary" onClick={() => handleBulkMove('to_contact')} aria-label="Move selected leads to To Contact">Move to To Contact</Button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Advanced Filtering/Search */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-4 mb-6 px-4"
      >
        <input
          type="text"
          placeholder="Search by name, company, or email..."
          aria-label="Search leads"
          className="flex-1 bg-dark-bg-tertiary text-white rounded px-4 py-2 text-sm border border-dark-border focus:outline-none focus:ring-2 focus:ring-rarity-600 transition"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex gap-2 flex-wrap justify-center sm:justify-start">
          <button
            className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activePersona === null ? 'bg-rarity-600 text-white border-rarity-600' : 'bg-dark-bg-tertiary text-secondary-text border-dark-border hover:bg-dark-bg-secondary'}`}
            aria-label="Show all personas"
            onClick={() => setActivePersona(null)}
          >
            All Personas
          </button>
          {Array.from(new Set(leadRequests.map(req => req.persona))).map(persona => (
            <button
              key={persona}
              className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activePersona === persona ? 'bg-rarity-600 text-white border-rarity-600' : 'bg-dark-bg-tertiary text-secondary-text border-dark-border hover:bg-dark-bg-secondary'}`}
              aria-label={`Filter by persona: ${persona}`}
              onClick={() => setActivePersona(persona)}
            >
              {persona}
            </button>
          ))}
        </div>
      </motion.div>
      {/* API-enriched lead creation */}
      <div className="w-full max-w-3xl mb-6 px-4">
        <LeadInputForm />
      </div>
      {/* Manual lead creation */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mb-6 mx-4 bg-card-bg rounded-xl border border-dark-border p-4 lg:p-6"
      >
        <div className="font-medium text-primary-text mb-2">Create Lead Manually</div>
        <form className="flex flex-col md:flex-row md:items-center gap-4" onSubmit={handleManualLeadSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            aria-label="Full Name"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.full_name}
            onChange={e => setManualLeadForm(f => ({ ...f, full_name: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="Company Name"
            aria-label="Company Name"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.company_name}
            onChange={e => setManualLeadForm(f => ({ ...f, company_name: e.target.value }))}
            required
          />
          <input
            type="email"
            placeholder="Email"
            aria-label="Email"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.email}
            onChange={e => setManualLeadForm(f => ({ ...f, email: e.target.value }))}
            required
          />
          <input
            type="text"
            placeholder="WhatsApp Number"
            aria-label="WhatsApp Number"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.whatsapp || ''}
            onChange={e => setManualLeadForm(f => ({ ...f, whatsapp: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Company Website"
            aria-label="Company Website"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.website || ''}
            onChange={e => setManualLeadForm(f => ({ ...f, website: e.target.value }))}
          />
          <input
            type="text"
            placeholder="Social Media"
            aria-label="Social Media"
            className="bg-dark-bg-tertiary text-white rounded px-2 py-2 text-sm border border-dark-border flex-1 min-w-[120px]"
            value={manualLeadForm.social || ''}
            onChange={e => setManualLeadForm(f => ({ ...f, social: e.target.value }))}
          />
          <Button
            type="submit"
            variant="primary"
            aria-label="Create manual lead"
            disabled={manualLeadLoading}
            className="min-w-[120px] md:ml-2"
          >
            {manualLeadLoading ? "Creating..." : "Create Lead"}
          </Button>
        </form>
      </motion.div>
      <div className="w-full max-w-3xl flex flex-col md:flex-row gap-6">
        {/* Previous Lead Searches (API-enriched) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 bg-card-bg rounded-xl border border-dark-border p-4 min-h-[300px]"
        >
          <div className="font-medium text-primary-text mb-2">Previous Lead Searches</div>
          {loading ? (
            <div className="text-secondary-text">Loading...</div>
          ) : filteredLeadRequests.length === 0 ? (
            <div className="text-secondary-text">No previous lead searches yet.</div>
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
                    <span className="ml-2 text-xs text-secondary-text">{new Date(req.created_at).toLocaleDateString()}</span>
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
          className="flex-[2] bg-card-bg rounded-xl border border-dark-border p-4 min-h-[300px]"
        >
          <div className="font-medium text-primary-text mb-2">Results</div>
          <Suspense fallback={<div className="text-secondary-text">Loading leads...</div>}>
            <LeadsResultsGrid leads={leads} />
          </Suspense>
        </motion.div>
      </div>
      {/* Manual Leads List with checkboxes and details modal */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl mt-8 bg-card-bg rounded-xl border border-dark-border p-6"
      >
        <div className="flex items-center mb-2">
          <input type="checkbox" checked={isAllSelected} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={toggleSelectAll} aria-label="Select all leads" className="mr-2" />
          <div className="font-medium text-primary-text">Manually Created Leads</div>
        </div>
        {filteredManualLeads.length === 0 ? (
          <div className="text-secondary-text">No manually created leads yet.</div>
        ) : (
          <ul className="space-y-2">
            {filteredManualLeads.map(lead => (
              <li key={lead.id} className={`bg-dark-bg-tertiary rounded p-2 text-white text-sm flex items-center gap-2 ${selectedLeads.includes(lead.id) ? 'ring-2 ring-rarity-600' : ''}`}> 
                <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={() => toggleSelect(lead.id)} aria-label={`Select lead ${lead.full_name}`} />
                <div className="flex-1 cursor-pointer" onClick={() => setDetailsLead(lead)}>
                  <div className="font-medium">{lead.full_name}</div>
                  <div className="text-xs text-secondary-text">{lead.company_name}</div>
                  <div className="text-xs text-secondary-text">{lead.email}</div>
                  <div className="text-xs text-secondary-text">Created {new Date(lead.created_at).toLocaleDateString()}</div>
                </div>
              </li>
            ))}
          </ul>
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
              className="bg-card-bg rounded-xl border border-dark-border p-8 w-full max-w-lg relative"
              onClick={e => e.stopPropagation()}
              tabIndex={0}
            >
              <button className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl" aria-label="Close details" onClick={() => setDetailsLead(null)}>&times;</button>
              <div className="text-lg font-medium text-white mb-4">Lead Details</div>
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
                  toast({ title: 'Lead updated', description: 'Lead details updated.' });
                  setDetailsLead(editLead);
                } catch {
                  toast({ title: 'Error', description: 'Failed to update lead', variant: 'destructive' });
                }
                setEditing(false);
              }} className="flex flex-col gap-2">
                <label className="text-xs text-secondary-text">Full Name</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editLead?.full_name ?? ''} onChange={e => setEditLead(l => l ? { ...l, full_name: e.target.value } : l)} />
                <label className="text-xs text-secondary-text">Company Name</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editLead?.company_name ?? ''} onChange={e => setEditLead(l => l ? { ...l, company_name: e.target.value } : l)} />
                <label className="text-xs text-secondary-text">Email</label>
                <input type="text" className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editLead?.email ?? ''} onChange={e => setEditLead(l => l ? { ...l, email: e.target.value } : l)} />
                <label className="text-xs text-secondary-text">Status</label>
                <select className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border" value={editLead?.status ?? ''} onChange={e => setEditLead(l => l ? { ...l, status: e.target.value } : l)}>
                  <option value="to_contact">To Contact</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_conversation">In Conversation</option>
                  <option value="closed">Closed</option>
                </select>
                <div className="flex gap-2 mt-4">
                  <Button type="submit" variant="primary" loading={editing} aria-label="Save changes">Save</Button>
                  <Button type="button" variant="secondary" onClick={() => setEditLead(detailsLead)} aria-label="Cancel edit">Cancel</Button>
                  <Button type="button" variant="danger" onClick={async () => { if (window.confirm('Delete this lead?')) { await supabase.from('leads').delete().eq('id', detailsLead.id); setManualLeads(prev => prev.filter(l => l.id !== detailsLead.id)); setLeads(prev => prev.filter(l => l.id !== detailsLead.id)); setDetailsLead(null); toast({ title: 'Lead deleted', description: 'Lead deleted.' }); }}} aria-label="Delete lead">Delete</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('json')} aria-label="Export lead as JSON">Export JSON</Button>
                  <Button type="button" variant="secondary" onClick={() => handleBulkExport('csv')} aria-label="Export lead as CSV">Export CSV</Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 