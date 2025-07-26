"use client"

import { useEffect, useState, useMemo } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale, Tooltip } from 'chart.js';
Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);
import { AnimatePresence } from 'framer-motion';

const STAGES = [
  { key: "to_contact", label: "To Contact" },
  { key: "contacted", label: "Contacted" },
  { key: "in_conversation", label: "In Conversation" },
  { key: "closed", label: "Closed" },
]

type Lead = {
  id: string
  user_id: string
  full_name: string
  company_name: string
  email: string
  status: string
  created_at: string
}

export default function CrmPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [newLead, setNewLead] = useState<{ [stage: string]: { full_name: string; company_name: string; email: string } }>({})
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStage, setModalStage] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState('');
  const [activeStatus, setActiveStatus] = useState<string | null>(null);
  const { toast } = useToast();
  const [focusedCard, setFocusedCard] = useState<{ stage: string; idx: number } | null>(null);
  const cardRefs = useRef<Record<string, HTMLLIElement[]>>({});
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [detailsLead, setDetailsLead] = useState<Lead | null>(null);
  const detailsModalRef = useRef<HTMLDivElement>(null);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const fetchUserAndLeads = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user?.id) {
        setLoading(false)
        return
      }
      setUserId(session.user.id)
      // Fetch leads for this user
      const { data: leadsData, error } = await supabase
        .from("leads")
        .select("*")
        .eq("user_id", session.user.id)
      if (!error && leadsData) {
        setLeads(leadsData)
      }
      setLoading(false)
    }
    fetchUserAndLeads()
  }, [])

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Filtered leads by search and status
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => {
      const matchesSearch =
        lead.full_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.company_name.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = activeStatus ? lead.status === activeStatus : true;
      return matchesSearch && matchesStatus;
    });
  }, [leads, search, activeStatus]);

  // Group filtered leads by stage
  const leadsByStage = STAGES.reduce((acc, stage) => {
    acc[stage.key] = filteredLeads.filter(l => l.status === stage.key);
    return acc;
  }, {} as Record<string, Lead[]>);

  // Enhanced handleDragEnd with toast and highlight
  const handleDragEnd = async (event: any) => {
    const { active, over } = event;
    if (!active || !over) {
      setDraggedLead(null);
      return;
    }
    const leadId = active.id;
    const newStage = over.id;
    const lead = leads.find(l => l.id === leadId);
    if (!lead || lead.status === newStage) {
      setDraggedLead(null);
      return;
    }
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStage } : l));
    try {
      await supabase.from('leads').update({ status: newStage }).eq('id', leadId);
      toast({ title: 'Lead moved', description: `${lead.full_name} moved to ${STAGES.find(s => s.key === newStage)?.label}` });
    } catch {
      toast({ title: 'Error', description: 'Failed to update lead status', variant: 'destructive' });
    }
    setDraggedLead(null);
  };

  // Keyboard navigation for cards/columns
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedCard) return;
    const { stage, idx } = focusedCard;
    if (e.key === 'ArrowRight') {
      const nextStageIdx = STAGES.findIndex(s => s.key === stage) + 1;
      if (nextStageIdx < STAGES.length) {
        setFocusedCard({ stage: STAGES[nextStageIdx].key, idx: 0 });
      }
    } else if (e.key === 'ArrowLeft') {
      const prevStageIdx = STAGES.findIndex(s => s.key === stage) - 1;
      if (prevStageIdx >= 0) {
        setFocusedCard({ stage: STAGES[prevStageIdx].key, idx: 0 });
      }
    } else if (e.key === 'ArrowDown') {
      setFocusedCard({ stage, idx: idx + 1 });
    } else if (e.key === 'ArrowUp') {
      setFocusedCard({ stage, idx: Math.max(0, idx - 1) });
    }
  };

  // Modal lead creation
  const handleOpenModal = (stage: string) => {
    setModalStage(stage);
    setIsModalOpen(true);
    setTimeout(() => {
      modalRef.current?.focus();
    }, 100);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalStage(null);
  };
  // Keyboard shortcut for modal
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' || e.key === 'N') {
        setModalStage(STAGES[0].key);
        setIsModalOpen(true);
      }
      if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleCreateLead = async (stage: string) => {
    if (!userId) return
    const leadData = newLead[stage]
    if (!leadData?.full_name || !leadData?.company_name || !leadData?.email) return
    setLoading(true)
    // Insert into leads table
    const { data: inserted, error } = await supabase
      .from("leads")
      .insert([{ user_id: userId, full_name: leadData.full_name, company_name: leadData.company_name, email: leadData.email, status: stage }])
      .select()
      .single()
    if (!error && inserted) {
      setLeads(prev => [...prev, inserted])
      setNewLead(prev => ({ ...prev, [stage]: { full_name: "", company_name: "", email: "" } }))
      toast({ title: 'Lead created', description: `${leadData.full_name} created in ${STAGES.find(s => s.key === stage)?.label}` });
    } else {
      toast({ title: 'Error', description: 'Failed to create lead', variant: 'destructive' });
    }
    setLoading(false)
  }

  const allIds = leads.map(l => l.id);
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
      setLeads(prev => prev.filter(l => !selectedLeads.includes(l.id)));
      toast({ title: 'Leads deleted', description: `${selectedLeads.length} leads deleted.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to delete leads', variant: 'destructive' });
    }
    setSelectedLeads([]);
  };
  const handleBulkExport = (format: 'csv' | 'json') => {
    const allLeads = leads.filter(l => selectedLeads.includes(l.id));
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
  const handleBulkMove = async (stage: string) => {
    try {
      await supabase.from('leads').update({ status: stage }).in('id', selectedLeads);
      setLeads(prev => prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: stage } : l));
      toast({ title: 'Leads moved', description: `${selectedLeads.length} leads moved to ${stage}.` });
    } catch {
      toast({ title: 'Error', description: 'Failed to move leads', variant: 'destructive' });
    }
    setSelectedLeads([]);
  };

  // Analytics
  const stageCounts = ['to_contact', 'contacted', 'in_conversation', 'closed'].map(stage =>
    leads.filter(l => l.status === stage).length
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
    <div className="min-h-screen bg-main-bg w-full overflow-x-hidden" onKeyDown={handleKeyDown} tabIndex={0}>
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-xl lg:text-2xl font-medium text-primary-text mb-6 px-4 pt-4"
      >
        CRM Pipeline
      </motion.h1>
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
            className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activeStatus === null ? 'bg-rarity-600 text-white border-rarity-600' : 'bg-dark-bg-tertiary text-secondary-text border-dark-border hover:bg-dark-bg-secondary'}`}
            aria-label="Show all statuses"
            onClick={() => setActiveStatus(null)}
          >
            All
          </button>
          {STAGES.map(stage => (
            <button
              key={stage.key}
              className={`px-3 py-1 rounded-full text-xs font-medium transition border ${activeStatus === stage.key ? 'bg-rarity-600 text-white border-rarity-600' : 'bg-dark-bg-tertiary text-secondary-text border-dark-border hover:bg-dark-bg-secondary'}`}
              aria-label={`Filter by ${stage.label}`}
              onClick={() => setActiveStatus(stage.key)}
            >
              {stage.label}
            </button>
          ))}
        </div>
      </motion.div>
      {/* Floating + New Lead button */}
      <button
        aria-label="Add new lead"
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 z-50 bg-rarity-600 hover:bg-rarity-700 text-white rounded-full shadow-lg w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center text-2xl lg:text-3xl focus:outline-none focus:ring-2 focus:ring-rarity-600 transition"
        onClick={() => handleOpenModal(STAGES[0].key)}
      >
        +
      </button>
      {/* Modal for quick add */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          tabIndex={-1}
          onClick={handleCloseModal}
        >
          <motion.div
            ref={modalRef}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-card-bg rounded-xl border border-dark-border p-8 w-full max-w-md focus:outline-none"
            onClick={e => e.stopPropagation()}
            tabIndex={0}
          >
            <div className="text-lg font-medium text-white mb-4">Create New Lead</div>
            <form
              className="flex flex-col gap-3"
              onSubmit={e => {
                e.preventDefault();
                handleCreateLead(modalStage!);
                handleCloseModal();
              }}
            >
              <input
                type="text"
                placeholder="Full Name"
                aria-label="Full Name"
                className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                value={newLead[modalStage!]?.full_name || ""}
                onChange={e => setNewLead(prev => ({ ...prev, [modalStage!]: { ...prev[modalStage!], full_name: e.target.value } }))}
                required
              />
              <input
                type="text"
                placeholder="Company Name"
                aria-label="Company Name"
                className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                value={newLead[modalStage!]?.company_name || ""}
                onChange={e => setNewLead(prev => ({ ...prev, [modalStage!]: { ...prev[modalStage!], company_name: e.target.value } }))}
                required
              />
              <input
                type="email"
                placeholder="Email"
                aria-label="Email"
                className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                value={newLead[modalStage!]?.email || ""}
                onChange={e => setNewLead(prev => ({ ...prev, [modalStage!]: { ...prev[modalStage!], email: e.target.value } }))}
                required
              />
              <Button
                type="submit"
                variant="primary"
                aria-label="Create lead"
                className="mt-2"
              >
                Create Lead
              </Button>
            </form>
            <button
              aria-label="Close modal"
              className="absolute top-4 right-4 text-secondary-text hover:text-white text-2xl"
              onClick={handleCloseModal}
            >
              ×
            </button>
          </motion.div>
        </div>
      )}
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
      {/* Analytics */}
      <motion.div className="w-full max-w-5xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="text-lg text-primary-text font-medium">Total Leads: {leads.length}</div>
        <div className="text-sm text-secondary-text">Selected: {selectedLeads.length}</div>
        <div className="flex-1 min-w-[220px]">
          <Bar data={chartData} options={chartOptions} height={80} />
        </div>
        <div className="text-sm text-secondary-text">Conversion Rate: {(conversionRate * 100).toFixed(1)}%</div>
      </motion.div>
      {/* Kanban DnD context with checkboxes and details modal */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={e => {
          const lead = leads.find(l => l.id === e.active.id);
          setDraggedLead(lead || null);
        }}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAGES.map(stage => (
            <SortableContext
              key={stage.key}
              items={leadsByStage[stage.key].map(l => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card-bg rounded-xl border border-dark-border p-4 min-h-[250px] flex flex-col"
              >
                <div className="flex items-center mb-2">
                  <input type="checkbox" checked={isAllSelected} ref={el => { if (el) el.indeterminate = isIndeterminate; }} onChange={toggleSelectAll} aria-label="Select all leads" className="mr-2" />
                  <div className="text-lg font-medium text-white">{stage.label}</div>
                </div>
                <form
                  className="flex flex-col gap-2 mb-4"
                  onSubmit={e => {
                    e.preventDefault();
                    handleCreateLead(stage.key);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    aria-label="Full Name"
                    className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                    value={newLead[stage.key]?.full_name || ""}
                    onChange={e => setNewLead(prev => ({ ...prev, [stage.key]: { ...prev[stage.key], full_name: e.target.value } }))}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    aria-label="Company Name"
                    className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                    value={newLead[stage.key]?.company_name || ""}
                    onChange={e => setNewLead(prev => ({ ...prev, [stage.key]: { ...prev[stage.key], company_name: e.target.value } }))}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    aria-label="Email"
                    className="bg-dark-bg-tertiary text-white rounded px-2 py-1 text-sm border border-dark-border"
                    value={newLead[stage.key]?.email || ""}
                    onChange={e => setNewLead(prev => ({ ...prev, [stage.key]: { ...prev[stage.key], email: e.target.value } }))}
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    aria-label={`Create lead in ${stage.label}`}
                    disabled={loading}
                    className="mt-1"
                  >
                    {loading ? "Creating..." : "Create Lead"}
                  </Button>
                </form>
                <div className="flex-1">
                  {loading ? (
                    <div className="text-secondary-text">Loading...</div>
                  ) : leadsByStage[stage.key].length === 0 ? (
                    <div className="text-secondary-text">No leads in this stage yet.</div>
                  ) : (
                    <ul className="space-y-2">
                      {leadsByStage[stage.key].map((lead, idx) => (
                        <motion.li
                          key={lead.id}
                          layout
                          className={`bg-dark-bg-tertiary rounded p-2 text-white text-sm flex items-center gap-2 cursor-grab hover:shadow-lg transition ${draggedLead?.id === lead.id ? 'ring-2 ring-rarity-600' : ''} ${focusedCard?.stage === stage.key && focusedCard?.idx === idx ? 'ring-2 ring-rarity-600' : ''} ${selectedLeads.includes(lead.id) ? 'ring-2 ring-rarity-600' : ''}`}
                          style={{ boxShadow: draggedLead?.id === lead.id ? '0 0 0 2px #8B5CF6' : undefined }}
                          tabIndex={0}
                          aria-label={`Lead: ${lead.full_name}`}
                          id={lead.id}
                          ref={el => {
                            if (!cardRefs.current[stage.key]) cardRefs.current[stage.key] = [];
                            cardRefs.current[stage.key][idx] = el!;
                          }}
                          onFocus={() => setFocusedCard({ stage: stage.key, idx })}
                          onClick={() => setDetailsLead(lead)}
                        >
                          <input type="checkbox" checked={selectedLeads.includes(lead.id)} onChange={e => { e.stopPropagation(); toggleSelect(lead.id); }} aria-label={`Select lead ${lead.full_name}`} />
                          <div className="flex-1" onClick={() => setDetailsLead(lead)}>
                            <div className="font-medium">{lead.full_name}</div>
                            <div className="text-xs text-secondary-text">{lead.company_name}</div>
                            <div className="text-xs text-secondary-text">{lead.email}</div>
                            <div className="text-xs text-secondary-text">Created {new Date(lead.created_at).toLocaleDateString()}</div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>
              </motion.div>
            </SortableContext>
          ))}
        </div>
        <DragOverlay>
          {draggedLead && (
            <motion.div
              className="bg-dark-bg-tertiary rounded p-2 text-white text-sm shadow-2xl"
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0.8 }}
            >
              <div className="font-medium">{draggedLead.full_name}</div>
              <div className="text-xs text-secondary-text">{draggedLead.company_name}</div>
              <div className="text-xs text-secondary-text">{draggedLead.email}</div>
            </motion.div>
          )}
        </DragOverlay>
      </DndContext>
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
                  <Button type="button" variant="danger" onClick={async () => { if (window.confirm('Delete this lead?')) { await supabase.from('leads').delete().eq('id', detailsLead.id); setLeads(prev => prev.filter(l => l.id !== detailsLead.id)); setDetailsLead(null); toast({ title: 'Lead deleted', description: 'Lead deleted.' }); }}} aria-label="Delete lead">Delete</Button>
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