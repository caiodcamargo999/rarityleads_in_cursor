"use client"

import { motion, useInView } from 'framer-motion'
import { useRef, useState } from 'react'
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Upload,
  ArrowRight,
  Building2,
  Mail,
  Phone,
  MapPin,
  Target
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function LeadsPage() {
  const leadsRef = useRef(null)
  const leadsInView = useInView(leadsRef, { once: true })
  const [searchTerm, setSearchTerm] = useState('')

  const leads: Array<{
    id: string;
    name: string;
    company: string;
    email: string;
    phone: string;
    location: string;
    status: string;
    score: number;
  }> = [
    // Empty for now - will be populated with real data
  ]

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div ref={leadsRef} className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={leadsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <h1 className="text-2xl md:text-3xl font-normal text-white mb-2">
            Lead Prospecting
          </h1>
          <p className="text-base text-gray-400">
            Manage and qualify your prospects with AI-powered insights.
          </p>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={leadsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
        >
          <Button variant="primary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium bg-[#8b5cf6] text-white border border-[#8b5cf6]">
            <Plus className="w-6 h-6" />
            <span>Add Lead</span>
            <span className="text-sm opacity-80">Manual entry</span>
          </Button>
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium bg-[#232336] text-white border border-[#8b5cf6]">
            <Upload className="w-6 h-6" />
            <span>Import CSV</span>
            <span className="text-sm opacity-80">Bulk import</span>
          </Button>
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium bg-[#232336] text-white border border-[#8b5cf6]">
            <Target className="w-6 h-6" />
            <span>Find Prospects</span>
            <span className="text-sm opacity-80">AI discovery</span>
          </Button>
          <Button variant="secondary" size="lg" className="h-20 flex flex-col items-center justify-center gap-2 text-lg font-medium bg-[#232336] text-white border border-[#8b5cf6]">
            <Download className="w-6 h-6" />
            <span>Export Data</span>
            <span className="text-sm opacity-80">Download leads</span>
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={leadsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search leads by name, company, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#0a0a0a]/50 backdrop-blur-sm border border-gray-800 rounded-lg focus:ring-2 focus:ring-[#8b5cf6]/50 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  />
                </div>
                <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium bg-[#232336] text-white border border-[#8b5cf6]">
                  <Filter className="w-5 h-5" />
                  <span>Filters</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leads List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={leadsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card className="bg-[#1a1a1a]/50 backdrop-blur-xl border border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl font-normal text-white">All Leads</CardTitle>
              <CardDescription className="text-gray-400">
                {filteredLeads.length} leads found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredLeads.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="w-16 h-16 text-gray-600 mx-auto mb-6" />
                  <h3 className="text-xl font-normal text-white mb-4">
                    {searchTerm ? 'No leads found' : 'No leads yet'}
                  </h3>
                  <p className="text-gray-400 mb-8 max-w-md mx-auto">
                    {searchTerm 
                      ? 'Try adjusting your search terms or filters.'
                      : 'Start by adding your first lead or importing a CSV file.'
                    }
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button variant="primary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium bg-[#8b5cf6] text-white border border-[#8b5cf6]">
                      <Plus className="w-5 h-5" />
                      <span>Add Your First Lead</span>
                    </Button>
                    <Button variant="secondary" size="lg" className="flex items-center justify-center gap-2 text-base font-medium bg-[#232336] text-white border border-[#8b5cf6]">
                      <Upload className="w-5 h-5" />
                      <span>Import CSV</span>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredLeads.map((lead) => (
                    <motion.div
                      key={lead.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center space-x-4 p-6 bg-[#0a0a0a]/50 rounded-lg hover:bg-[#0a0a0a]/70 transition-all duration-300 border border-gray-800/50"
                    >
                      <div className="w-12 h-12 bg-[#8b5cf6] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-normal text-lg">{lead.name.charAt(0)}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-normal text-white truncate">{lead.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-normal ${
                            lead.status === 'Qualified' ? 'bg-green-500/20 text-green-400' :
                            lead.status === 'Contacted' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {lead.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Building2 className="w-4 h-4" />
                            <span className="truncate">{lead.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Mail className="w-4 h-4" />
                            <span className="truncate">{lead.email}</span>
                          </div>
                          {lead.phone && (
                            <div className="flex items-center space-x-1">
                              <Phone className="w-4 h-4" />
                              <span>{lead.phone}</span>
                            </div>
                          )}
                          {lead.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{lead.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-sm text-gray-400">AI Score</div>
                          <div className="text-lg font-normal text-[#8b5cf6]">{lead.score}%</div>
                        </div>
                        <Button variant="ghost" size="sm" className="flex items-center justify-center gap-2">
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
} 