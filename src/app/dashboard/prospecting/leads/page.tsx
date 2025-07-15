'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import FloatingProfilePanel from '@/components/FloatingProfilePanel';
import { supabase, getCurrentUser, getLeads, createLead, updateLead } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface Lead {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  title: string | null;
  department: string | null;
  seniority: string | null;
  ai_score: number;
  status: string;
  tags: string[] | null;
  source: string | null;
  created_at: string;
  companies?: {
    name: string;
    industry: string | null;
  };
}

export default function LeadsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isProfilePanelVisible, setIsProfilePanelVisible] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    minScore: 0
  });
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // New lead form state
  const [newLead, setNewLead] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    title: '',
    department: '',
    seniority: '',
    tags: [] as string[],
    source: 'manual'
  });

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth');
          return;
        }
        setUser(currentUser);
        await loadLeads(currentUser.id);
      } catch (error) {
        console.error('Error checking user:', error);
        router.push('/auth');
      }
    };
    checkUser();
  }, [router]);

  const loadLeads = async (userId: string) => {
    try {
      setLoading(true);
      const leadsData = await getLeads(userId);
      setLeads(leadsData || []);
    } catch (error) {
      console.error('Error loading leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddLead = async () => {
    if (!newLead.first_name.trim() || !newLead.last_name.trim()) return;
    
    try {
      const lead = await createLead({
        user_id: user!.id,
        first_name: newLead.first_name.trim(),
        last_name: newLead.last_name.trim(),
        email: newLead.email.trim() || null,
        phone: newLead.phone.trim() || null,
        linkedin_url: newLead.linkedin_url.trim() || null,
        title: newLead.title.trim() || null,
        department: newLead.department.trim() || null,
        seniority: newLead.seniority.trim() || null,
        tags: newLead.tags.length > 0 ? newLead.tags : null,
        source: newLead.source,
        status: 'new',
        ai_score: 0
      });
      
      setLeads(prev => [lead, ...prev]);
      setNewLead({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        linkedin_url: '',
        title: '',
        department: '',
        seniority: '',
        tags: [],
        source: 'manual'
      });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error creating lead:', error);
    }
  };

  const handleUpdateLeadStatus = async (leadId: string, newStatus: string) => {
    try {
      await updateLead(leadId, { status: newStatus });
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      ));
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const handleEnrichLead = async (leadId: string) => {
    try {
      // In a real implementation, this would call your lead enrichment service
      // For now, we'll simulate enrichment by updating the AI score
      const newScore = Math.floor(Math.random() * 100) + 1;
      await updateLead(leadId, { ai_score: newScore });
      setLeads(prev => prev.map(lead => 
        lead.id === leadId ? { ...lead, ai_score: newScore } : lead
      ));
    } catch (error) {
      console.error('Error enriching lead:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-500/20 text-blue-400';
      case 'contacted':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'qualified':
        return 'bg-green-500/20 text-green-400';
      case 'booked':
        return 'bg-purple-500/20 text-purple-400';
      case 'closed':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  // Filter leads based on search and filters
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      `${lead.first_name} ${lead.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === '' || lead.status === filters.status;
    const matchesSource = filters.source === '' || lead.source === filters.source;
    const matchesScore = lead.ai_score >= filters.minScore;
    
    return matchesSearch && matchesStatus && matchesSource && matchesScore;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-main-bg flex items-center justify-center">
        <div className="text-primary-text">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-main-bg flex">
      <Sidebar 
        user={user} 
        onProfileClick={() => setIsProfilePanelVisible(true)} 
      />
      
      <main className="flex-1 lg:ml-64 p-6">
        {/* Header */}
        <motion.header 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl lg:text-4xl font-medium text-primary-text mb-2">
                Leads
              </h1>
              <p className="text-lg text-secondary-text">
                Manage and qualify your prospects with AI-powered scoring.
              </p>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              variant="primary"
              className="px-6 py-3"
            >
              Add New Lead
            </Button>
          </div>
        </motion.header>

        {/* Filters and Search */}
        <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="bg-card-bg border border-border rounded-card p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Search
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search leads..."
                  className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text placeholder-secondary-text focus:outline-none focus:border-primary-text"
                />
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="booked">Booked</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Source
                </label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                >
                  <option value="">All Sources</option>
                  <option value="manual">Manual</option>
                  <option value="import">Import</option>
                  <option value="api">API</option>
                  <option value="enrichment">Enrichment</option>
                </select>
              </div>

              {/* Score Filter */}
              <div>
                <label className="block text-sm font-medium text-primary-text mb-2">
                  Min Score
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.minScore}
                  onChange={(e) => setFilters(prev => ({ ...prev, minScore: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                />
              </div>
            </div>
          </div>
        </motion.section>

        {/* Leads Table */}
        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="bg-card-bg border border-border rounded-card overflow-hidden">
            {filteredLeads.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 bg-button-bg rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-secondary-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-primary-text mb-2">No Leads Found</h3>
                <p className="text-secondary-text mb-6">
                  {leads.length === 0 ? 'Start by adding your first lead.' : 'Try adjusting your filters.'}
                </p>
                {leads.length === 0 && (
                  <Button
                    onClick={() => setShowAddModal(true)}
                    variant="primary"
                    className="px-6 py-3"
                  >
                    Add Your First Lead
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-button-bg border-b border-border">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Lead
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Score
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredLeads.map((lead, index) => (
                      <motion.tr 
                        key={lead.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                        className="hover:bg-button-bg transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-primary-text">
                              {lead.first_name} {lead.last_name}
                            </div>
                            <div className="text-sm text-secondary-text">
                              {lead.title}
                            </div>
                            {lead.tags && lead.tags.length > 0 && (
                              <div className="flex gap-1 mt-1">
                                {lead.tags.slice(0, 2).map((tag, tagIndex) => (
                                  <span key={tagIndex} className="px-2 py-1 text-xs bg-button-bg rounded-full text-secondary-text">
                                    {tag}
                                  </span>
                                ))}
                                {lead.tags.length > 2 && (
                                  <span className="px-2 py-1 text-xs bg-button-bg rounded-full text-secondary-text">
                                    +{lead.tags.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-secondary-text">
                            {lead.companies?.name || 'Unknown Company'}
                          </div>
                          <div className="text-xs text-secondary-text">
                            {lead.companies?.industry || 'Unknown Industry'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-secondary-text">
                            {lead.email || 'No email'}
                          </div>
                          <div className="text-sm text-secondary-text">
                            {lead.phone || 'No phone'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className={`text-sm font-medium ${getScoreColor(lead.ai_score)}`}>
                            {lead.ai_score}/100
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleEnrichLead(lead.id)}
                              variant="secondary"
                              className="px-3 py-1 text-xs"
                            >
                              Enrich
                            </Button>
                            <Button
                              onClick={() => router.push(`/dashboard/prospecting/leads/${lead.id}`)}
                              variant="primary"
                              className="px-3 py-1 text-xs"
                            >
                              View
                            </Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.section>

        {/* Add Lead Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <motion.div 
              className="bg-card-bg border border-border rounded-card p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-medium text-primary-text mb-4">Add New Lead</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={newLead.first_name}
                    onChange={(e) => setNewLead(prev => ({ ...prev, first_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={newLead.last_name}
                    onChange={(e) => setNewLead(prev => ({ ...prev, last_name: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={newLead.phone}
                    onChange={(e) => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newLead.title}
                    onChange={(e) => setNewLead(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-text mb-2">
                    LinkedIn URL
                  </label>
                  <input
                    type="url"
                    value={newLead.linkedin_url}
                    onChange={(e) => setNewLead(prev => ({ ...prev, linkedin_url: e.target.value }))}
                    className="w-full px-3 py-2 bg-button-bg border border-border rounded-btn text-primary-text focus:outline-none focus:border-primary-text"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowAddModal(false)}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddLead}
                  variant="primary"
                  className="flex-1"
                  disabled={!newLead.first_name.trim() || !newLead.last_name.trim()}
                >
                  Add Lead
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </main>

      <FloatingProfilePanel
        isVisible={isProfilePanelVisible}
        onClose={() => setIsProfilePanelVisible(false)}
        user={user}
        onLogout={handleLogout}
      />
    </div>
  );
}