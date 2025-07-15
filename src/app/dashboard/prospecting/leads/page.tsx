'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
}

export default function LeadsPage() {
  const router = useRouter()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [enriching, setEnriching] = useState({})
  const [filters, setFilters] = useState({
    status: 'all',
    scoreMin: 0,
    source: 'all'
  })
  const [selectedLeads, setSelectedLeads] = useState(new Set())
  const [showAddLead, setShowAddLead] = useState(false)

  useEffect(() => {
    fetchLeads()
  }, [filters])

  const fetchLeads = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth')
        return
      }

      let query = supabase
        .from('leads')
        .select(`
          *,
          company:companies(*),
          lead_enrichments(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      const { data, error } = await query

      if (error) throw error

      // Filter by score
      const filteredData = data.filter(lead => {
        const score = lead.lead_enrichments?.[0]?.ai_score || 0
        return score >= filters.scoreMin
      })

      setLeads(filteredData)
    } catch (error) {
      console.error('Error fetching leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const enrichLead = async (leadId) => {
    setEnriching(prev => ({ ...prev, [leadId]: true }))
    
    try {
      const lead = leads.find(l => l.id === leadId)
      const response = await fetch('http://localhost:3006/enrich', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': (await supabase.auth.getUser()).data.user.id
        },
        body: JSON.stringify({
          leadId,
          domain: lead.company?.data?.domain,
          email: lead.data?.email,
          companyName: lead.company?.name
        })
      })

      const { jobId } = await response.json()
      
      // Poll for job status
      const checkStatus = setInterval(async () => {
        const statusRes = await fetch(`http://localhost:3006/status/${jobId}`)
        const status = await statusRes.json()
        
        if (status.state === 'completed') {
          clearInterval(checkStatus)
          setEnriching(prev => ({ ...prev, [leadId]: false }))
          fetchLeads() // Refresh to show new data
        } else if (status.state === 'failed') {
          clearInterval(checkStatus)
          setEnriching(prev => ({ ...prev, [leadId]: false }))
          console.error('Enrichment failed:', status.failedReason)
        }
      }, 2000)
    } catch (error) {
      console.error('Error enriching lead:', error)
      setEnriching(prev => ({ ...prev, [leadId]: false }))
    }
  }

  const bulkEnrich = async () => {
    const selectedLeadIds = Array.from(selectedLeads)
    const leadsToEnrich = leads.filter(l => selectedLeadIds.includes(l.id))
    
    try {
      const response = await fetch('http://localhost:3006/enrich/batch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'user-id': (await supabase.auth.getUser()).data.user.id
        },
        body: JSON.stringify({
          leads: leadsToEnrich.map(lead => ({
            leadId: lead.id,
            domain: lead.company?.data?.domain,
            email: lead.data?.email,
            companyName: lead.company?.name
          }))
        })
      })

      const { jobIds } = await response.json()
      
      // Mark all as enriching
      selectedLeadIds.forEach(id => {
        setEnriching(prev => ({ ...prev, [id]: true }))
      })

      // Clear selection
      setSelectedLeads(new Set())
      
      // Refresh after a delay
      setTimeout(fetchLeads, 5000)
    } catch (error) {
      console.error('Error bulk enriching:', error)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    if (score >= 40) return 'text-orange-500'
    return 'text-red-500'
  }

  const getStatusBadge = (status) => {
    const colors = {
      new: 'bg-blue-500/20 text-blue-400',
      contacted: 'bg-purple-500/20 text-purple-400',
      qualified: 'bg-green-500/20 text-green-400',
      unqualified: 'bg-red-500/20 text-red-400'
    }
    return colors[status] || 'bg-gray-500/20 text-gray-400'
  }

  return (
    <div className="min-h-screen bg-[#18181c] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-3xl font-medium text-white mb-2">Lead Prospecting</h1>
          <p className="text-[#b0b0b0]">AI-powered lead discovery and enrichment</p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex gap-4">
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-4 py-2 bg-[#232336] text-white rounded-lg border border-[#393552] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="unqualified">Unqualified</option>
            </select>

            <select
              value={filters.scoreMin}
              onChange={(e) => setFilters({ ...filters, scoreMin: parseInt(e.target.value) })}
              className="px-4 py-2 bg-[#232336] text-white rounded-lg border border-[#393552] focus:outline-none focus:border-[#8B5CF6]"
            >
              <option value="0">All Scores</option>
              <option value="40">Score 40+</option>
              <option value="60">Score 60+</option>
              <option value="80">Score 80+</option>
            </select>

            {selectedLeads.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={bulkEnrich}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Enrich {selectedLeads.size} Leads
              </motion.button>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddLead(true)}
            className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
          >
            Add Lead
          </motion.button>
        </motion.div>

        {/* Leads Table */}
        <motion.div 
          className="bg-[#232336] rounded-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#8B5CF6]"></div>
            </div>
          ) : leads.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-[#b0b0b0] mb-4">No leads found</p>
              <button
                onClick={() => setShowAddLead(true)}
                className="px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
              >
                Add Your First Lead
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#18181c] border-b border-[#393552]">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLeads(new Set(leads.map(l => l.id)))
                          } else {
                            setSelectedLeads(new Set())
                          }
                        }}
                        className="rounded border-[#393552]"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Company</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Score</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Industry</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Decision Makers</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#e0e0e0]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {leads.map((lead) => {
                      const enrichment = lead.lead_enrichments?.[0]
                      const score = enrichment?.ai_score || 0
                      const decisionMakers = enrichment?.decision_makers || []
                      
                      return (
                        <motion.tr
                          key={lead.id}
                          variants={fadeInUp}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                          className="border-b border-[#393552] hover:bg-[#2a2a3f] transition-colors"
                        >
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={selectedLeads.has(lead.id)}
                              onChange={(e) => {
                                const newSelected = new Set(selectedLeads)
                                if (e.target.checked) {
                                  newSelected.add(lead.id)
                                } else {
                                  newSelected.delete(lead.id)
                                }
                                setSelectedLeads(newSelected)
                              }}
                              className="rounded border-[#393552]"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-white font-medium">
                                {lead.company?.name || lead.data?.company_name || 'Unknown'}
                              </div>
                              {lead.company?.data?.domain && (
                                <div className="text-sm text-[#b0b0b0]">{lead.company.data.domain}</div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            {enrichment ? (
                              <div className={`text-2xl font-medium ${getScoreColor(score)}`}>
                                {score}
                              </div>
                            ) : (
                              <span className="text-[#b0b0b0]">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(lead.status)}`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-[#e0e0e0]">
                              {enrichment?.enrichment_data?.company?.industry || '-'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {decisionMakers.length > 0 ? (
                              <div className="flex -space-x-2">
                                {decisionMakers.slice(0, 3).map((dm, idx) => (
                                  <div
                                    key={idx}
                                    className="w-8 h-8 bg-[#8B5CF6] rounded-full flex items-center justify-center text-white text-xs font-medium"
                                    title={`${dm.name} - ${dm.title}`}
                                  >
                                    {dm.name?.charAt(0) || '?'}
                                  </div>
                                ))}
                                {decisionMakers.length > 3 && (
                                  <div className="w-8 h-8 bg-[#393552] rounded-full flex items-center justify-center text-white text-xs">
                                    +{decisionMakers.length - 3}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <span className="text-[#b0b0b0]">-</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              {!enrichment && (
                                <button
                                  onClick={() => enrichLead(lead.id)}
                                  disabled={enriching[lead.id]}
                                  className="px-3 py-1 bg-[#8B5CF6] text-white text-sm rounded-lg hover:bg-[#7C3AED] transition-colors disabled:opacity-50"
                                >
                                  {enriching[lead.id] ? (
                                    <span className="flex items-center gap-1">
                                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                      Enriching
                                    </span>
                                  ) : (
                                    'Enrich'
                                  )}
                                </button>
                              )}
                              <button
                                onClick={() => router.push(`/dashboard/leads/${lead.id}`)}
                                className="px-3 py-1 bg-[#232336] text-white text-sm rounded-lg hover:bg-[#2a2a3f] transition-colors"
                              >
                                View
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Add Lead Modal */}
        <AnimatePresence>
          {showAddLead && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowAddLead(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#232336] rounded-xl p-6 max-w-md w-full"
              >
                <h2 className="text-xl font-medium text-white mb-4">Add New Lead</h2>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault()
                    const formData = new FormData(e.target)
                    
                    try {
                      const { data: { user } } = await supabase.auth.getUser()
                      
                      // Create company first
                      const { data: company } = await supabase
                        .from('companies')
                        .insert({
                          user_id: user.id,
                          name: formData.get('company_name'),
                          data: {
                            domain: formData.get('domain')
                          }
                        })
                        .select()
                        .single()

                      // Create lead
                      await supabase
                        .from('leads')
                        .insert({
                          user_id: user.id,
                          company_id: company.id,
                          status: 'new',
                          data: {
                            contact_email: formData.get('email')
                          }
                        })

                      setShowAddLead(false)
                      fetchLeads()
                    } catch (error) {
                      console.error('Error creating lead:', error)
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-[#e0e0e0] mb-1">Company Name</label>
                      <input
                        name="company_name"
                        required
                        className="w-full px-4 py-2 bg-[#18181c] text-white rounded-lg border border-[#393552] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#e0e0e0] mb-1">Domain</label>
                      <input
                        name="domain"
                        placeholder="example.com"
                        className="w-full px-4 py-2 bg-[#18181c] text-white rounded-lg border border-[#393552] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-[#e0e0e0] mb-1">Contact Email</label>
                      <input
                        name="email"
                        type="email"
                        className="w-full px-4 py-2 bg-[#18181c] text-white rounded-lg border border-[#393552] focus:outline-none focus:border-[#8B5CF6]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-[#8B5CF6] text-white rounded-lg hover:bg-[#7C3AED] transition-colors"
                    >
                      Add Lead
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddLead(false)}
                      className="flex-1 px-4 py-2 bg-[#393552] text-white rounded-lg hover:bg-[#4a4665] transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}